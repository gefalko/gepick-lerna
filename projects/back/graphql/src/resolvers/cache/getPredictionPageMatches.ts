import { findMatchesByDay, Match, MatchPredictions } from '@gepick/database'
import * as moment from 'moment'
import { map } from 'lodash'
import { findMatchOddsByMatchIds } from '@gepick/database/src/models/matchOdds/functions'
import { findMatchPredictionsByMatchIds } from '@gepick/database/src/models/matchPredictions/functions'
import {
  BetLabels,
  BetLabelMatchWinnerValue,
  BetLabelGoalsUnderValue,
  BetLabelGoalsOverValue,
} from '@gepick/utils/src/BetLabels'
import { MatchOdds } from '@gepick/database/src/models/matchOdds/MatchOddsModel'
import { bookmakerIdList, botsList } from '@gepick/utils/src/predictionsPageConfig'
import { oddToProbability } from '@gepick/utils'

interface IValueBotBetVsOdd {
  botDockerImage: string
  probability: number
}

type Bet = BetLabelMatchWinnerValue | BetLabelGoalsUnderValue | BetLabelGoalsOverValue

function toOddsByBookmaker(
  oddsByLabel: MatchOdds[],
  bookmakerId: number,
  bet: Bet,
  botPredictionsByBet: (IValueBotBetVsOdd | null)[],
) {
  const oddsByBookmaker = oddsByLabel.filter((oddsItem) => {
    return oddsItem.apiFootballBookamkerId === bookmakerId
  })

  const odds = oddsByBookmaker
    .map((oddsItem) => {
      const oddsByBet = oddsItem.oddsByBet.find((oddsByBetItem) => {
        return oddsByBetItem.bet === bet
      })

      if (!oddsByBet) {
        return null
      }

      const oddProbability = oddToProbability(oddsByBet.oddSize)

      const valueBotBetVsOdd = botPredictionsByBet.filter((botPredictionsByBetItem) => {
        return botPredictionsByBetItem && botPredictionsByBetItem.probability > oddProbability
      })

      return {
        valueBotBetVsOdd,
        oddSize: oddsByBet.oddSize,
        probability: oddProbability,
        updateAt: oddsItem.updateAt,
      }
    })
    .filter((i) => i !== null)

  return {
    bookmakerId,
    odds,
  }
}

function toPredictionsByBot(predictions: MatchPredictions[], botDockerImage: string, bet: Bet) {
  const predictionsByBot = predictions.find((predictionsItem) => {
    return predictionsItem.botDockerImage === botDockerImage
  })

  if (!predictionsByBot) {
    return null
  }

  const predictionsByBet = predictionsByBot?.predictionsByBet.find((predictionsItem) => {
    return predictionsItem.bet === bet
  })

  if (!predictionsByBet) {
    return null
  }

  return {
    botDockerImage,
    probability: predictionsByBet.probability,
  }
}

function toDataByBet(bet: Bet, oddsByLabel: MatchOdds[], predictionsByLabel: MatchPredictions[]) {
  const botPredictionsByBet = botsList
    .map((botImage) => toPredictionsByBot(predictionsByLabel, botImage, bet))
    .filter((i) => i !== null)

  return {
    bet,
    bookmakerOddsByBet: bookmakerIdList.map((bookmakerId) =>
      toOddsByBookmaker(oddsByLabel, bookmakerId, bet, botPredictionsByBet),
    ),
    botPredictionsByBet,
  }
}

function toDataByLabel(
  betLabel: typeof BetLabels.MatchWinner | typeof BetLabels.GoalsOverUnder,
  odds: MatchOdds[],
  predictions: MatchPredictions[],
) {
  const oddsByLabel = odds.filter((oddsItem) => {
    return oddsItem.betLabelId === betLabel.apiFootballLabelId
  })

  const predictionsByLabel = predictions.filter((predictionsItem) => {
    return predictionsItem.betLabelId === betLabel.apiFootballLabelId
  })

  const dataByBet = map(betLabel.values, (bet) => {
    return toDataByBet(bet as Bet, oddsByLabel, predictionsByLabel)
  })

  return {
    betLabelId: betLabel.apiFootballLabelId,
    betLabelName: betLabel.name,
    dataByBet,
  }
}

function calculateRowHeight(matchesOdds: MatchOdds[]) {
  if (matchesOdds.length) {
    return 1100
  }

  return 750
}

interface IPagination {
  offset: number
  limit: number
}

export interface IPredictionPageMatch {
  _id?: string
  formatedStartTime: string
  countryName: string
  homeTeamName: string
  awayTeamName: string
  leagueName: string
  countryFlag?: string
  countryId: string
  score?: object
  dataByLabel: object
  rowHeight: number
}

async function getPredictionPageMatches(day: string, pagination?: IPagination): Promise<IPredictionPageMatch[]> {
  const allMatches = await findMatchesByDay({
    day,
    populateOptions: {
      homeTeam: true,
      awayTeam: true,
      league: true,
      country: true,
    },
  })

  const getMatches = () => {
    if (pagination) {
      const { offset, limit } = pagination
      return allMatches.slice(offset, limit + offset)
    }

    return allMatches
  }

  const matches = getMatches()

  const matchIds = matches.map((match) => match._id)

  const matchesOdds = await findMatchOddsByMatchIds({ ids: matchIds })

  const matchesPredictions = await findMatchPredictionsByMatchIds(matchIds)

  const toPredictionsPageMatch = (match: Match) => {
    const odds = matchesOdds.filter((matchOdds) => matchOdds.matchId.toString() === match._id?.toString())

    const predictions = matchesPredictions.filter(
      (prediction) => prediction.matchId.toString() === match._id?.toString(),
    )

    const dataByLabel = map(BetLabels, (betLabel) => {
      return toDataByLabel(betLabel, odds, predictions)
    })

    const predictionsPageMatch: IPredictionPageMatch = {
      _id: match._id,
      formatedStartTime: moment(match.startTime).format('HH:mm'),
      countryName: match.countryName,
      homeTeamName: match.homeTeamName,
      awayTeamName: match.awayTeamName,
      leagueName: match.leagueName,
      countryFlag: match.country.flag,
      countryId: match.country._id,
      score: match.score,
      dataByLabel,
      rowHeight: calculateRowHeight(odds),
    }

    return predictionsPageMatch
  }

  const predictionsPageMatches = matches.map(toPredictionsPageMatch)

  return predictionsPageMatches
}

export default getPredictionPageMatches
