import { round } from 'lodash'
import { bookmakerExplorerLabels } from '@gepick/config/src/bookmakerExplorerConfig'
import { Match } from '@gepick/database/src/models/match/MatchModel'
import { IBetLabel } from '@gepick/utils/src/BetLabels'
import { oddToProbability, BetLabels, BetLabelIdEnum } from '@gepick/utils'
import { IdList } from '@gepick/database/src/models/idList/IdListModel'
import { findMatchOddsByMatchIds } from '@gepick/database/src/models/matchOdds/functions'
import { createIdList } from '@gepick/database/src/models/idList/functions'
import { IBookmakerExplorerInterval, availableIntervals } from '@gepick/utils/src/BookmakerExplorerInterval'
import { MatchOdds } from '@gepick/database/src/models/matchOdds/MatchOddsModel'
import { isMatchWinnerBetWin, isMatchUnderOverBetWin } from '@gepick/utils/src/isBetWin'
import { ReportPeriodEnum } from '@gepick/utils/src/enums'
import { createOrUpdateBookmakerExplorer_intervalReport } from '@gepick/database/src/models/bookmakerExplorer_intervalReport/functions'
import { BookmakerExplorer_intervalReport } from '@gepick/database/src/models/bookmakerExplorer_intervalReport/BookmakerExplorer_intervalReport'

interface IItem {
  odd: MatchOdds
  match: Match
  bet: string
  oddSize: number
  probability: number
}

interface IFormatOddsbyBetArgs {
  odds: MatchOdds[]
  matches: Match[]
  bet: string
  betLabelId: number
}

function formatOddsByBet(args: IFormatOddsbyBetArgs) {
  const oddsByBet: IItem[] = []

  args.odds.forEach((item) => {
    item.oddsByBet.forEach((betOdd) => {
      if (betOdd.bet === args.bet) {
        const match = args.matches.find((matchItem) => matchItem?._id?.toString() === item.matchId)
        oddsByBet.push({
          match: match!,
          bet: betOdd.bet,
          odd: item,
          oddSize: betOdd.oddSize,
          probability: oddToProbability(betOdd.oddSize),
        })
      }
    })
  })

  return oddsByBet
}

interface ICreateIntervalReport {
  betLabelId: BetLabelIdEnum
  bet: string
  interval: IBookmakerExplorerInterval
  matches: Match[]
  odds: MatchOdds[]
  oddsIdList: IdList
  bookmakerId: number
  year: number
  yearMonth?: number
  monthDay?: number
  yearWeek?: number
  periodType: ReportPeriodEnum
}

async function createIntervalReport(args: ICreateIntervalReport) {
  const oddsByBet = formatOddsByBet({
    odds: args.odds,
    matches: args.matches,
    bet: args.bet,
    betLabelId: args.betLabelId,
  })

  const { from, to, key } = args.interval

  const betOddsByInterval = oddsByBet.filter((betOdd) => {
    const oddProbability = betOdd.probability
    return oddProbability >= from && oddProbability <= to
  })

  const itemsWithResults = betOddsByInterval.filter((betOddByInterval) => {
    return betOddByInterval.match.goalsHomeTeam != null && betOddByInterval.match.goalsAwayTeam != null
  })

  const totalWithResults = itemsWithResults.length

  const correctItems = itemsWithResults.filter((item) => {
    const goals = { home: item.match.goalsHomeTeam!, away: item.match.goalsAwayTeam! }

    if (args.betLabelId === BetLabels.MatchWinner.apiFootballLabelId) {
      return isMatchWinnerBetWin(goals, item.bet)
    }

    if (args.betLabelId === BetLabels.GoalsOverUnder.apiFootballLabelId) {
      return isMatchUnderOverBetWin(goals, item.bet)
    }

    throw new Error('Bet label is not correct')
  })

  const getBookmakerOccuracyPercent = () => {
    if (totalWithResults === 0) {
      return null
    }

    return Math.round((correctItems.length / totalWithResults) * 100)
  }

  const bookmakerOccuracyPercent = getBookmakerOccuracyPercent()

  const totalIncorrect = totalWithResults - correctItems.length

  const getDiffStatus = () => {
    if (bookmakerOccuracyPercent === null) {
      return null
    }

    const diffStatus = bookmakerOccuracyPercent - from

    if (diffStatus < 0) {
      return diffStatus
    }

    if (diffStatus > 10) {
      return diffStatus - 10
    }

    return 0
  }

  const calculateProfit = () => {
    const profit = correctItems.reduce((acc, item) => {
      return acc + (item.oddSize - 1)
    }, 0)

    return profit - totalIncorrect
  }

  const calculateAverageOdd = () => {
    if (itemsWithResults.length === 0) {
      return null
    }

    const oddsSum = itemsWithResults.reduce((acc, item) => {
      return acc + item.oddSize
    }, 0)

    return oddsSum / itemsWithResults.length
  }

  const averageOdd = calculateAverageOdd()

  const report = {
    bookmakerId: args.bookmakerId,
    betLabelId: args.betLabelId,
    bet: args.bet,
    intervalFrom: from,
    intervalTo: to,
    intervalKey: key,
    periodType: args.periodType,
    year: args.year,
    yearMonth: args.yearMonth,
    monthDay: args.monthDay,
    yearWeek: args.yearWeek,
    bookmakerOccuracyPercent,
    odds: args.oddsIdList,
    profit: round(calculateProfit(), 2),
    averageOdd: averageOdd ? round(averageOdd, 2) : null,
    averageProbability: averageOdd ? round(oddToProbability(averageOdd), 2) : null,
    totalIncorrect,
    total: betOddsByInterval.length,
    totalWithResults,
    totalCorrect: correctItems.length,
    diffStatus: getDiffStatus(),
  } as BookmakerExplorer_intervalReport

  return createOrUpdateBookmakerExplorer_intervalReport(report)
}

interface ICreateBetLabelBetReportsArgs {
  betLabelId: BetLabelIdEnum
  matches: Match[]
  bet: string
  bookmakerId: number
  year: number
  oddsIdList: IdList
  yearMonth?: number
  monthDay?: number
  yearWeek?: number
  periodType: ReportPeriodEnum
  odds: MatchOdds[]
}

async function createBetLabelBetReports(args: ICreateBetLabelBetReportsArgs) {
  for (let interval of availableIntervals) {
    await createIntervalReport({
      bookmakerId: args.bookmakerId,
      odds: args.odds,
      oddsIdList: args.oddsIdList,
      betLabelId: args.betLabelId,
      bet: args.bet,
      interval,
      matches: args.matches,
      year: args.year,
      yearMonth: args.yearMonth,
      monthDay: args.monthDay,
      yearWeek: args.yearWeek,
      periodType: args.periodType,
    })
  }

  return null
}

interface ICreateBetLabelReportsArgs {
  betLabel: IBetLabel
  matches: Match[]
  bookmakerId: number
  year: number
  yearMonth?: number
  monthDay?: number
  yearWeek?: number
  periodType: ReportPeriodEnum
}

async function createBetLabelReports(args: ICreateBetLabelReportsArgs) {
  const betLabelBets = args.betLabel.values

  const matchIds = args.matches.map((match) => match._id)

  const odds = await findMatchOddsByMatchIds({
    ids: matchIds as string[],
    bookmakersApiIds: [args.bookmakerId],
    betLabelIds: [args.betLabel.apiFootballLabelId],
  })

  const dbIdList = await createIdList({ matchOdds: odds })

  for (let bet of Object.values(betLabelBets)) {
    await createBetLabelBetReports({
      odds,
      oddsIdList: dbIdList,
      bookmakerId: args.bookmakerId,
      betLabelId: args.betLabel.apiFootballLabelId,
      bet: bet as string,
      matches: args.matches,
      year: args.year,
      yearMonth: args.yearMonth,
      monthDay: args.monthDay,
      yearWeek: args.yearWeek,
      periodType: args.periodType,
    })
  }

  return null
}

interface ICreateBookmakerExplorerReportArgs {
  matches: Match[]
  periodType: ReportPeriodEnum
  year: number
  yearMonth?: number
  monthDay?: number
  yearWeek?: number
}

export async function createBookmakerExplorerReport(args: ICreateBookmakerExplorerReportArgs) {
  for (let betLabel of Object.values(bookmakerExplorerLabels)) {
    await createBetLabelReports({
      bookmakerId: 1,
      betLabel,
      matches: args.matches,
      year: args.year,
      yearMonth: args.yearMonth,
      monthDay: args.monthDay,
      periodType: args.periodType,
      yearWeek: args.yearWeek,
    })
  }
}
