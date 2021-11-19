import { printlog } from '@gepick/utils'
import { pickBy, identity } from 'lodash'
import { ReportPeriodEnum } from '@gepick/utils/src/enums'
import { IntervalKeyType } from '@gepick/utils/src/BookmakerExplorerInterval'
import BookmakerExplorer_intervalReportModel, {
  BookmakerExplorer_intervalReport,
} from './BookmakerExplorer_intervalReport'

export async function createBookmakerExplorer_intervalReport(report: BookmakerExplorer_intervalReport) {
  try {
    const dbReport = await new BookmakerExplorer_intervalReportModel(report).save()

    return dbReport
  } catch (err) {
    printlog('Failed save report')
    throw err
  }
}

export async function createOrUpdateBookmakerExplorer_intervalReport(report: BookmakerExplorer_intervalReport) {
  try {
    const dbReport = await BookmakerExplorer_intervalReportModel.update(
      {
        bookmakerId: report.bookmakerId,
        betLabelId: report.betLabelId,
        bet: report.bet,
        intervalFrom: report.intervalFrom,
        intervalTo: report.intervalTo,
        intervalKey: report.intervalKey,
        periodType: report.periodType,
        year: report.year,
        yearQuarter: report.yearQuarter,
        yearMonth: report.yearMonth,
        monthDay: report.monthDay,
        yearWeek: report.yearWeek,
      },
      {
        profit: report.profit,
        averageOdd: report.averageOdd,
        averageProbability: report.averageProbability,
        bookmakerOccuracyPercent: report.bookmakerOccuracyPercent,
        totalWithResults: report.totalWithResults,
        totalIncorrect: report.totalIncorrect,
        totalCorrect: report.totalCorrect,
        diffStatus: report.diffStatus,
        source: report.source,
        odds: report.odds,
      },
      { upsert: true },
    )

    return dbReport
  } catch (err) {
    printlog('Failed save or update report')
    throw err
  }
}

interface IFindBookmakerExplorer_intervalReportArgs {
  betLabelId: number
  periodType: ReportPeriodEnum
  year?: number
  yearMonth?: number
  monthDay?: number
  yearWeek?: number
  bet?: string
  intervalKey?: IntervalKeyType
}

export async function findBookmakerExplorer_intervalReports(args: IFindBookmakerExplorer_intervalReportArgs) {
  const query = pickBy(
    {
      betLabelId: args.betLabelId,
      periodType: args.periodType,
      year: args.year,
      yearMonth: args.yearMonth,
      monthDay: args.monthDay,
      yearWeek: args.yearWeek,
      intervalKey: args.intervalKey,
      bet: args.bet,
    },
    identity,
  )

  const dbReportList = await BookmakerExplorer_intervalReportModel.find(query)

  return dbReportList
}
