import * as moment from 'moment'
import { Field, ObjectType } from 'type-graphql'
import { chain, map } from 'lodash'
import { findMatchesByDay, Match, MatchPredictions } from '@gepick/database'
import { findMatchOddsByMatchIds } from '@gepick/database/src/models/matchOdds/functions'
import { findMatchPredictionsByMatchIds } from '@gepick/database/src/models/matchPredictions/functions'
import { getBookmakerName } from '@gepick/utils/src/bookmakers'
import { MatchOdds } from '@gepick/database/src/models/matchOdds/MatchOddsModel'
import { BetLabels } from '@gepick/utils'

@ObjectType()
export class PredictionsPageMatchScore {
  @Field({ nullable: true })
  public halftime!: string

  @Field({ nullable: true })
  public fulltime!: string
}

@ObjectType()
class MatchOddsByBookmakerOdds {
  @Field()
  public bet: string

  @Field(() => Number, { nullable: true })
  public oddSize: number | null
}

@ObjectType()
class MatchOddsByBookmaker {
  @Field(() => Number)
  public bookmakerId: number
  @Field()
  public bookmakerName: string

  @Field(() => [MatchOddsByBookmakerOdds])
  public odds: MatchOddsByBookmakerOdds[]
}

@ObjectType()
class MatchPredictionsByBotPredictions {
  @Field()
  public bet: string

  @Field(() => Number, { nullable: true })
  public probability: number | null
}

@ObjectType()
class MatchPredictionsByBot {
  @Field()
  public botDockerImage: string

  @Field(() => [MatchPredictionsByBotPredictions])
  public predictions: MatchPredictionsByBotPredictions[]
}

@ObjectType()
export class PredictionsPageMatchV2 {
  @Field()
  public _id!: string

  @Field()
  public formatedStartTime!: string

  @Field()
  public homeTeamName!: string

  @Field()
  public awayTeamName!: string

  @Field()
  public countryName!: string

  @Field()
  public countryId!: string

  @Field({ nullable: true })
  public countryFlag?: string

  @Field()
  public leagueName!: string

  @Field(() => PredictionsPageMatchScore, { nullable: true })
  public score?: PredictionsPageMatchScore

  @Field(() => [MatchOddsByBookmaker])
  public matchOddsByBookmaker!: MatchOddsByBookmaker[]

  @Field(() => [MatchPredictionsByBot])
  public matchPredictionsByBot!: MatchPredictionsByBot[]
}

interface IGetPredictionPageMatchesV2Args {
  day: string
}

async function getPredictionPageMatchesV2(args: IGetPredictionPageMatchesV2Args): Promise<PredictionsPageMatchV2[]> {
  const allDayMatches = await findMatchesByDay({
    day: args.day,
    populateOptions: {
      homeTeam: true,
      awayTeam: true,
      league: true,
      country: true,
    },
  })

  const matchIds = allDayMatches.map((match) => match._id)

  const matchesOdds = await findMatchOddsByMatchIds({ ids: matchIds })

  const matchesPredictions = await findMatchPredictionsByMatchIds(matchIds)

  const toPredictionsPageMatch = (match: Match) => {
    const odds = matchesOdds.filter((matchOdds) => matchOdds.matchId.toString() === match._id?.toString())

    const predictions = matchesPredictions.filter(
      (prediction) => prediction.matchId.toString() === match._id?.toString(),
    )

    const formatMatchOddsByBookamker = () => {
      const formatMatchOdds = (bookmakerOdds: MatchOdds[]) => {
        let matchWinnerOddsBets: MatchOdds['oddsByBet'] = []
        let matchGoalsUnderOverOddsBets: MatchOdds['oddsByBet'] = []

        bookmakerOdds.forEach((bookmakerOddsItem) => {
          if (bookmakerOddsItem.betLabelId === BetLabels.MatchWinner.apiFootballLabelId) {
            matchWinnerOddsBets = matchWinnerOddsBets.concat(bookmakerOddsItem.oddsByBet)
          }
          if (bookmakerOddsItem.betLabelId === BetLabels.GoalsOverUnder.apiFootballLabelId) {
            matchGoalsUnderOverOddsBets = matchGoalsUnderOverOddsBets.concat(bookmakerOddsItem.oddsByBet)
          }
        })

        const matchWinnerFormatedOdds = map(BetLabels.MatchWinner.values, (value) => {
          const bet = matchWinnerOddsBets.find((matchWinnerOddsBetsItem) => {
            return matchWinnerOddsBetsItem.bet === value
          })

          return {
            bet: value,
            oddSize: bet?.oddSize ?? null,
          }
        })

        const goalsOverUnderFormatedOdds = map(BetLabels.GoalsOverUnder.values, (value) => {
          const bet = matchGoalsUnderOverOddsBets.find((matchGoalsUnderOverOddsBetsItem) => {
            return matchGoalsUnderOverOddsBetsItem.bet === value
          })

          return {
            bet: value,
            oddSize: bet?.oddSize ?? null,
          }
        })

        return [...matchWinnerFormatedOdds, ...goalsOverUnderFormatedOdds]
      }

      const formatted = chain(odds)
        .groupBy('apiFootballBookamkerId')
        .map((matchOdds, key) => ({
          bookmakerId: parseInt(key, 10),
          bookmakerName: getBookmakerName(parseInt(key, 10)),
          odds: formatMatchOdds(matchOdds),
        }))
        .value()

      return formatted
    }

    const formatMatchPredictionsByBot = () => {
      const formatPredictions = (botPredictions: MatchPredictions[]) => {
        let matchWinnerPredictions: MatchPredictions['predictionsByBet'] = []
        let matchGoalsUnderOverPredictions: MatchPredictions['predictionsByBet'] = []

        botPredictions.forEach((botPredictionsItem) => {
          if (botPredictionsItem.betLabelId === BetLabels.MatchWinner.apiFootballLabelId) {
            matchWinnerPredictions = matchWinnerPredictions.concat(botPredictionsItem.predictionsByBet)
          }
          if (botPredictionsItem.betLabelId === BetLabels.GoalsOverUnder.apiFootballLabelId) {
            matchGoalsUnderOverPredictions = matchGoalsUnderOverPredictions.concat(botPredictionsItem.predictionsByBet)
          }
        })

        const matchWinnerFormatedPredictions = map(BetLabels.MatchWinner.values, (value) => {
          const bet = matchWinnerPredictions.find((matchWinnerPredictionsItem) => {
            return matchWinnerPredictionsItem.bet === value
          })

          return {
            bet: value,
            probability: bet?.probability ?? null,
          }
        })

        const matchGoalsUnderOverFormatedPredictions = map(BetLabels.GoalsOverUnder.values, (value) => {
          const bet = matchGoalsUnderOverPredictions.find((matchGoalsUnderOverPredictionsItem) => {
            return matchGoalsUnderOverPredictionsItem.bet === value
          })

          return {
            bet: value,
            probability: bet?.probability ?? null,
          }
        })

        return [...matchWinnerFormatedPredictions, ...matchGoalsUnderOverFormatedPredictions]
      }

      const formated = chain(predictions)
        .groupBy('botDockerImage')
        .map((botPredictions, key) => ({ botDockerImage: key, predictions: formatPredictions(botPredictions) }))
        .value()

      return formated
    }

    const predictionsPageMatch: PredictionsPageMatchV2 = {
      _id: match._id as string,
      formatedStartTime: moment(match.startTime).format('HH:mm'),
      countryName: match.countryName,
      homeTeamName: match.homeTeamName,
      awayTeamName: match.awayTeamName,
      leagueName: match.leagueName,
      countryId: match.country._id,
      countryFlag: match.country.flag,
      score: match.score as PredictionsPageMatchV2['score'],
      matchOddsByBookmaker: formatMatchOddsByBookamker(),
      matchPredictionsByBot: formatMatchPredictionsByBot(),
    }

    return predictionsPageMatch
  }

  const predictionsPageMatches = allDayMatches.map(toPredictionsPageMatch)

  return predictionsPageMatches
}

export default getPredictionPageMatchesV2
