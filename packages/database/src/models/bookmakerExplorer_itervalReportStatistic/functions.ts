import { IntervalKeyType } from '@gepick/utils/src/BookmakerExplorerInterval'
import BookmakerExplorer_intervalReportStaisticModel from './BookmakerExplorer_intervalReportStatistic'

interface IUpdateReportStatisticArgs {
  bookmakerId: number
  betLabelId: number
  bet: string
  intervalKey: IntervalKeyType
  todayStatistic: {
    day: string
    allTimeRoi: number
  }
}

export async function updateBookmakerExplorerReportStatistic(args: IUpdateReportStatisticArgs) {
  const res = await BookmakerExplorer_intervalReportStaisticModel.updateOne(
    {
      bookmakerId: args.bookmakerId,
      betLabelId: args.betLabelId,
      bet: args.bet,
      intervalKey: args.intervalKey,
    },
    { todayStatistic: args.todayStatistic, daysStatistic: [] },
    { upsert: true },
  )

  return res
}

export async function findAllBookmakerExplorerReportStatistic() {
  const dbList = await BookmakerExplorer_intervalReportStaisticModel.find()

  return dbList
}
