import { findMatchesByWeek } from '@gepick/database'
import { ReportPeriodEnum } from '@gepick/utils/src/enums'
import { createBookmakerExplorerReport } from './utils'

async function createWeeklyBookmakerExplorerReport(year: number, yearWeek: number) {
  const matches = await findMatchesByWeek({
    year,
    yearWeek,
  })

  await createBookmakerExplorerReport({
    matches,
    year,
    yearWeek,
    periodType: ReportPeriodEnum.WEEK,
  })
}

export default createWeeklyBookmakerExplorerReport
