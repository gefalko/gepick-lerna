import { Resolver, ObjectType, Field, Query, InputType, Arg } from 'type-graphql'
import { round } from 'lodash'
import { IntervalKeyType, availableIntervals } from '@gepick/utils/src/BookmakerExplorerInterval'
import { findMatchPredictionsByTimeInterval, MatchPredictions, findMatchesById, Match } from '@gepick/database'
import { isMatchFinished, isBetWin, isDefined } from '@gepick/utils'
import { findMatchOddsByMatchIds } from '@gepick/database/src/models/matchOdds/functions'
import { getBookmakerName } from '@gepick/utils/src/bookmakers'
import { enumerateDaysBetweenDates } from '@gepick/utils/src/dates'
import { findDayPicksBySettings } from '@gepick/database/src/functions/predictions2Picks/predictions2Picks'
import calculatePicksStatistic from '@gepick/database/src/functions/predictions2Picks/utils/calculatePicksStatistics'
import { PickStatusEnum } from '@gepick/database/src/types'

interface IFormatIntervalBetPredictionsArgs {
  predictions: MatchPredictions[]
  intervalKey: string
  bet: string
}

function formatIntervalBetPredictions(args: IFormatIntervalBetPredictionsArgs) {
  const [fromInterval, toInterval] = args.intervalKey.split('-')

  const formatedPredictions = args.predictions.map((predictionsItem) => {
    const betPrediction = predictionsItem.predictionsByBet.find((betPredictionItem) => {
      return betPredictionItem.bet === args.bet
    })

    if (
      betPrediction &&
      betPrediction.probability > parseInt(fromInterval, 10) &&
      betPrediction.probability <= parseInt(toInterval, 10)
    ) {
      return {
        matchId: predictionsItem.matchId,
        predictionId: predictionsItem._id,
        probability: betPrediction.probability,
      }
    }

    return undefined
  })

  return formatedPredictions.filter((formatedPredictionsItem) => formatedPredictionsItem !== undefined)
}

@InputType()
class BotExplorerBetReportQueryInput {
  @Field(() => String)
  public botDockerImage!: string

  @Field(() => Number)
  public betLabelId!: number

  @Field(() => String)
  public bet!: string

  @Field(() => String)
  public dayFrom!: string

  @Field(() => String)
  public dayTo!: string
}

@InputType()
class BotExplorerReportQueryInput {
  @Field(() => String)
  public botDockerImage!: string

  @Field(() => Number)
  public betLabelId!: number

  @Field(() => String)
  public bet!: string

  @Field(() => String)
  public dayFrom!: string

  @Field(() => String)
  public dayTo!: string

  @Field(() => Number)
  public probabilityFrom!: number

  @Field(() => Number)
  public probabilityTo!: number

  @Field(() => Number)
  public oddProbabilityFrom!: number

  @Field(() => Number)
  public oddProbabilityTo!: number

  @Field(() => Number)
  public valueFrom!: number

  @Field(() => Number)
  public valueTo!: number

  @Field(() => Number)
  public oddIndex!: number
}

@ObjectType()
class BotIntervalReport {
  @Field(() => String)
  public intervalKey!: IntervalKeyType

  @Field(() => Number)
  public totalPredictions!: number

  @Field(() => Number)
  public totalPredictionsWithResult!: number

  @Field(() => Number)
  public totalCorrect!: number

  @Field(() => Number)
  public totalNotCorrect!: number

  @Field(() => Number)
  public correctPercent!: number

  @Field(() => [String])
  public predictionIdList: string
}

@ObjectType()
class MatchPredictionsPick {
  @Field(() => Match)
  match: Match

  @Field(() => Number)
  probability: number

  @Field(() => Number, { nullable: true })
  profit: number

  @Field(() => Number, { nullable: true })
  oddSize?: number

  @Field(() => String, { nullable: true })
  bookmakerName?: string

  @Field(() => Boolean, { nullable: true })
  isPickWin: boolean
}

@ObjectType()
class MatchPredictionsStatistic {
  @Field(() => Number)
  total: number

  @Field(() => Number)
  totalWithResultAndOdd: number

  @Field(() => Number)
  totalCorrect: number

  @Field(() => Number)
  totalNotCorrect: number

  @Field(() => Number)
  totalProfit: number

  @Field(() => Number)
  profitPerPick: number

  @Field(() => Number)
  roi: number
}

@ObjectType()
class BotIntervalPredictionsResponse {
  @Field(() => [MatchPredictionsPick])
  picks: MatchPredictionsPick[]

  @Field(() => MatchPredictionsStatistic)
  statistic: MatchPredictionsStatistic
}

@InputType()
class BotIntervalPredictionsInput {
  @Field(() => String)
  public intervalKey!: IntervalKeyType

  @Field(() => String)
  public botDockerImage!: string

  @Field(() => Number)
  public betLabelId!: number

  @Field(() => String)
  public bet!: string

  @Field(() => String)
  public dayFrom!: string

  @Field(() => String)
  public dayTo!: string
}

@ObjectType()
class BotExplorerReportStatistic {
  @Field(() => Number)
  public total!: number

  @Field(() => Number)
  public totalFinished!: number

  @Field(() => Number)
  public totalCorrect!: number

  @Field(() => Number)
  public totalNotCorrect!: number

  @Field(() => Number)
  public totalProfit!: number

  @Field(() => Number)
  public profitPerPick!: number
}

@ObjectType()
class BotExplorerReport {
  @Field(() => String)
  public day!: string

  @Field(() => BotExplorerReportStatistic)
  public statistic!: BotExplorerReportStatistic
}

@ObjectType()
class BotExplorerReportResponse {
  @Field(() => [BotExplorerReport])
  public reports!: BotExplorerReport[]

  @Field(() => BotExplorerReportStatistic)
  public overallStatistic!: BotExplorerReportStatistic
}

@Resolver()
class BotExplorerPageResolver {
  @Query(() => BotExplorerReportResponse)
  async botExplorerReport(@Arg('args') args: BotExplorerReportQueryInput) {
    const days = enumerateDaysBetweenDates(args.dayFrom, args.dayTo)
    const reports = []
    let allPicks: {
      status: PickStatusEnum
      isPickWin?: boolean
      odd: number
    }[] = []

    for (let day of days) {
      const dayPicks = await findDayPicksBySettings({
        day,
        settings: {
          botDockerImage: args.botDockerImage,
          betLabelId: args.betLabelId,
          bet: args.bet,
          oddIndex: args.oddIndex,
          valueFrom: args.valueFrom,
          valueTo: args.valueTo,
          probabilityFrom: args.probabilityFrom,
          probabilityTo: args.probabilityTo,
          oddProbabilityFrom: args.oddProbabilityFrom,
          oddProbabilityTo: args.oddProbabilityTo,
        },
      })

      const dayStatistics = calculatePicksStatistic({ picks: dayPicks })
      allPicks = allPicks.concat(dayPicks as any)

      reports.push({
        day,
        statistic: dayStatistics,
      })
    }

    return { reports, overallStatistic: calculatePicksStatistic({ picks: allPicks }) }
  }

  @Query(() => [BotIntervalReport])
  async botExplorerBetReport(@Arg('args') args: BotExplorerBetReportQueryInput) {
    const predictions = await findMatchPredictionsByTimeInterval({
      fromDay: args.dayFrom,
      toDay: args.dayTo,
      botDockerImage: args.botDockerImage,
      betLabelId: args.betLabelId,
    })

    const matchIds = predictions.map((predictionsItem) => predictionsItem.matchId)

    const matches = await findMatchesById(matchIds)

    const res = availableIntervals.map((interval) => {
      const intervalBetPredictions = formatIntervalBetPredictions({
        predictions,
        intervalKey: interval.key,
        bet: args.bet,
      })

      const intervalBetPredictionsMatchesIds = intervalBetPredictions.map((intervalBetPredictionsItem) => {
        return intervalBetPredictionsItem?.matchId
      })

      const intervalBetPredictionsIds = intervalBetPredictions.map((intervalBetPredictionsItem) => {
        return intervalBetPredictionsItem?.matchId
      })

      const intervalBetPredictionsMatches = matches.filter((matchesItem) => {
        return intervalBetPredictionsMatchesIds.includes(matchesItem._id?.toString())
      })

      const matchesWithResult = intervalBetPredictionsMatches.filter((intervalBetPredictionsMatchesItem) => {
        return isMatchFinished(intervalBetPredictionsMatchesItem.status)
      })

      const correctMatches = matchesWithResult.filter((matchesWithResultItem) => {
        if (matchesWithResultItem.goalsHomeTeam == null || matchesWithResultItem.goalsAwayTeam == null) {
          throw new Error('match not have result')
        }

        return isBetWin({
          betLabelId: args.betLabelId,
          bet: args.bet,
          goals: {
            home: matchesWithResultItem.goalsHomeTeam,
            away: matchesWithResultItem.goalsAwayTeam,
          },
        })
      })

      const totalCorrect = correctMatches.length
      const totalPredictionsWithResult = matchesWithResult.length

      const calculateCorrectPercent = () => {
        if (!totalPredictionsWithResult) {
          return 0
        }

        return Math.round((totalCorrect / totalPredictionsWithResult) * 100)
      }

      return {
        totalPredictions: intervalBetPredictions.length,
        intervalKey: interval.key,
        predictionIdList: intervalBetPredictionsIds,
        totalCorrect: correctMatches.length,
        totalNotCorrect: matchesWithResult.length - correctMatches.length,
        totalPredictionsWithResult: matchesWithResult.length,
        correctPercent: calculateCorrectPercent(),
      }
    })

    return res
  }

  @Query(() => BotIntervalPredictionsResponse)
  async botIntervalPredictions(@Arg('args') args: BotIntervalPredictionsInput) {
    const predictions = await findMatchPredictionsByTimeInterval({
      fromDay: args.dayFrom,
      toDay: args.dayTo,
      botDockerImage: args.botDockerImage,
      betLabelId: args.betLabelId,
    })

    const [fromInterval, toInterval] = args.intervalKey.split('-')

    const predictionToPick = (prediction: MatchPredictions) => {
      const predictionByBet = prediction.predictionsByBet.find((predictionsByBetItem) => {
        return predictionsByBetItem.bet === args.bet
      })

      if (!predictionByBet) {
        return undefined
      }

      const { probability } = predictionByBet

      if (probability < parseInt(fromInterval, 10) || probability > parseInt(toInterval, 10)) {
        return undefined
      }

      return {
        matchId: prediction.matchId,
        probability,
      }
    }

    const filteredPicks = predictions.map(predictionToPick).filter(isDefined)

    const picksMatchIdList = filteredPicks
      .map((pick) => {
        return pick?.matchId
      })
      .filter(isDefined) as string[]

    const matches = await findMatchesById(picksMatchIdList)
    const odds = await findMatchOddsByMatchIds({
      ids: picksMatchIdList,
      betLabelIds: [args.betLabelId],
    })

    const picksWithMatches = filteredPicks.map((filteredPicksItem) => {
      const match = matches.find((matchesItem) => {
        return matchesItem._id?.toString() === filteredPicksItem?.matchId.toString()
      })

      const matchOdds = odds.filter((oddsItem) => {
        return oddsItem.matchId.toString() === filteredPicksItem?.matchId.toString()
      })

      const oddIndex = Math.floor(matchOdds.length / 2)

      const odd = matchOdds[oddIndex]

      const betOdd = odd
        ? odd.oddsByBet.find((oddsByBetItem) => {
            return oddsByBetItem.bet === args.bet
          })
        : undefined

      const isPickWin = () => {
        if (match?.goalsAwayTeam == null || match?.goalsHomeTeam == null) {
          return undefined
        }

        return isBetWin({
          goals: {
            home: match.goalsHomeTeam,
            away: match.goalsAwayTeam,
          },
          betLabelId: args.betLabelId,
          bet: args.bet,
        })
      }

      const win = isPickWin()

      const calculateProfit = () => {
        if (!betOdd?.oddSize) {
          return undefined
        }

        if (win) {
          return round(betOdd.oddSize - 1, 2)
        }

        return -1
      }

      return {
        match,
        isPickWin: win,
        profit: calculateProfit(),
        oddSize: betOdd?.oddSize,
        bookmakerName: odd ? getBookmakerName(odd.apiFootballBookamkerId) : undefined,
        ...filteredPicksItem,
      }
    })

    const calculateStatistic = () => {
      const total = picksWithMatches.length

      const picksWithResultAndOdd = picksWithMatches.filter((picksWithMatchesItem) => {
        if (picksWithMatchesItem.match?.goalsHomeTeam == null) {
          return false
        }
        if (picksWithMatchesItem.match?.goalsAwayTeam == null) {
          return false
        }

        if (!picksWithMatchesItem.oddSize) {
          return false
        }

        return true
      })

      const totalWithResultAndOdd = picksWithResultAndOdd.length

      const correctPicks = picksWithResultAndOdd.filter((picksWithResultAndOddItem) => {
        return picksWithResultAndOddItem.isPickWin
      })

      const notCorrectPicks = picksWithResultAndOdd.filter((picksWithResultAndOddItem) => {
        return !picksWithResultAndOddItem.isPickWin
      })

      const calculateProfit = () => {
        const profit = picksWithResultAndOdd.reduce((currentProfit, picksWithResultAndOddItem) => {
          if (!picksWithResultAndOddItem.oddSize) {
            return currentProfit
          }

          if (!picksWithResultAndOddItem.isPickWin) {
            return -1
          }

          return currentProfit + (picksWithResultAndOddItem.oddSize - 1)
        }, 0)

        return profit
      }

      const totalProfit = calculateProfit()
      const profitPerPick = picksWithResultAndOdd.length ? totalProfit / picksWithResultAndOdd.length : 0
      const roi = round(profitPerPick / 100, 2)

      return {
        totalCorrect: correctPicks.length,
        totalNotCorrect: notCorrectPicks.length,
        total,
        totalWithResultAndOdd,
        totalProfit,
        profitPerPick,
        roi,
      }
    }

    const statistic = calculateStatistic()

    return { statistic, picks: picksWithMatches }
  }
}

export default BotExplorerPageResolver
