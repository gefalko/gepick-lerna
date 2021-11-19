import { connectToDb } from '@gepick/database'
import updateReportStatisticTask from '@gepick/tasks/src/bookmakerExplorerReports/updateBookmakerExplorerReportStatistic'

async function updateReportStatistic() {
  await connectToDb()
  await updateReportStatisticTask()
}

export default updateReportStatistic
