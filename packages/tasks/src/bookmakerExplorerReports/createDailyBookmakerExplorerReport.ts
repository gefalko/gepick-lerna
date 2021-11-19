import { findMatchesByDay } from '@gepick/database'
import { ReportPeriodEnum } from '@gepick/utils/src/enums'
import { createBookmakerExplorerReport } from './utils'

async function createDailyBookmakerExplorerReport(day: string) {
  const matches = await findMatchesByDay({
    day,
  })

  const date = new Date(day)

  const year = date.getFullYear()
  const yearMonth = date.getMonth()
  const monthDay = date.getDate()

  await createBookmakerExplorerReport({
    matches,
    year,
    yearMonth,
    monthDay,
    periodType: ReportPeriodEnum.DAY,
  })
}

export default createDailyBookmakerExplorerReport
