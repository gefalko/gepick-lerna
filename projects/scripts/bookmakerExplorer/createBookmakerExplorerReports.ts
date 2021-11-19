import { cmd } from '@gepick/utils'
import { connectToDb } from '@gepick/database'
import createDailyBookmakerExplorerReport from '@gepick/tasks/src/bookmakerExplorerReports/createDailyBookmakerExplorerReport'
import createWeeklyBookmakerExplorerReport from '@gepick/tasks/src/bookmakerExplorerReports/createWeeklyBookmakerExplorerReport'

async function createReports() {
  if (!cmd.day) {
    if (!cmd.year && !cmd.yearWeek) {
      throw new Error('period params is required' + JSON.stringify(cmd))
    }
  }

  await connectToDb()

  if (cmd.day) {
    await createDailyBookmakerExplorerReport(cmd.day)
  }

  if (cmd.year && cmd.yearWeek) {
    await createWeeklyBookmakerExplorerReport(cmd.year, cmd.yearWeek)
  }
}

export default createReports
