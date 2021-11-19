import { findAllPredictionBots } from '@gepick/database'
import { flatMap } from 'lodash'
import { generateReport } from '@gepick/utils/src/generateReport'
import { BetTypeEnum } from '@gepick/utils'
import { findBotBetValuePicksByDays } from '@gepick/database/src/models/botBetValuePicksByDay/functions'
import { saveOrUpdateBotReport } from '@gepick/database/src/models/botBetReportByPeriod/functions'
import { ReportPeriodEnum } from '@gepick/utils/src/enums'
import { toOneDayInterval } from '@gepick/utils/src/dates'

export async function generateBotsReportsTask(dayFromString: string, reportPeriod: ReportPeriodEnum) {
  const { fromDatetime, toDatetime } = toOneDayInterval(dayFromString)

  const bots = await findAllPredictionBots()
  for (const bot of bots) {
    const picksByBet = async (bet: BetTypeEnum) => {
      const botBetPicksByDays = await findBotBetValuePicksByDays(
        {
          dateFrom: fromDatetime.toDate(),
          dateTo: toDatetime.toDate(),
          botDbId: bot._id,
          bet,
        },
        true,
      )

      const picks = flatMap(botBetPicksByDays, (dayPicks) => dayPicks?.picks)

      return picks
    }

    const saveOrUpdateBetReport = async (bet: BetTypeEnum) => {
      const report = generateReport(await picksByBet(bet))

      await saveOrUpdateBotReport({
        dateFrom: fromDatetime.toDate(),
        dateTo: toDatetime.toDate(),
        reportPeriod,
        botDbId: bot._id,
        bot,
        botDockerImage: bot.dockerImage,
        report: report.report,
        bet,
      })
    }

    await saveOrUpdateBetReport(BetTypeEnum.HOME)
    await saveOrUpdateBetReport(BetTypeEnum.DRAW)
    await saveOrUpdateBetReport(BetTypeEnum.AWAY)
    await saveOrUpdateBetReport(BetTypeEnum.UNDER)
    await saveOrUpdateBetReport(BetTypeEnum.OVER)
  }
}
