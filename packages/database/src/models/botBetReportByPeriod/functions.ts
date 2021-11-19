import { ReportPeriodEnum } from '@gepick/utils/src/enums'
import { BetTypeEnum } from '@gepick/utils'
import BotBetReportByPeriodModel, { BotBetReportByPeriod } from './botBetReportByPeriodModel'

export async function updateBotBetReportByPeriod(report: BotBetReportByPeriod) {
  const updatedReport = await BotBetReportByPeriodModel.updateOne(
    {
      dateFrom: report.dateFrom,
      dateTo: report.dateTo,
      reportPeriod: report.reportPeriod,
      botDbId: report.botDbId,
    },
    report,
  )

  return updatedReport
}

interface IFindBotBetReportByPeriodProps {
  dateFrom: Date
  dateTo: Date
  botDbId: string
  reportPeriod: ReportPeriodEnum
  bet: BetTypeEnum
}

export async function findBotBetReportByPeriod(props: IFindBotBetReportByPeriodProps) {
  const dbReport = await BotBetReportByPeriodModel.findOne({
    dateFrom: props.dateFrom,
    dateTo: props.dateTo,
    botDbId: props.botDbId,
    bet: props.bet,
  })

  return dbReport
}

export async function findBotReportsByPeriod(props: IFindBotBetReportByPeriodProps) {
  const reports = await BotBetReportByPeriodModel.find({
    botDbId: props.botDbId,
    dateFrom: {
      $gte: props.dateFrom,
    },
    dateTo: {
      $lte: props.dateTo,
    },
    reportPeriod: props.reportPeriod,
  })

  return reports
}

export async function findBotBetReportsByPeriodAndBet(props: IFindBotBetReportByPeriodProps) {
  const reports = await BotBetReportByPeriodModel.find({
    botDbId: props.botDbId,
    dateFrom: {
      $gte: props.dateFrom,
    },
    dateTo: {
      $lte: props.dateTo,
    },
    reportPeriod: props.reportPeriod,
    bet: props.bet,
  })

  return reports
}

export async function saveOrUpdateBotReport(report: BotBetReportByPeriod) {
  if (
    await findBotBetReportByPeriod({
      dateFrom: report.dateFrom,
      dateTo: report.dateTo,
      botDbId: report.botDbId,
      reportPeriod: report.reportPeriod,
      bet: report.bet,
    })
  ) {
    const updatedBotReport = await updateBotBetReportByPeriod(report)

    return updatedBotReport
  }

  const newDbBotReport = await new BotBetReportByPeriodModel(report).save()

  return newDbBotReport
}
