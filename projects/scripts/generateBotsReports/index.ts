import { connectToDb } from '@gepick/database'
import { cmd } from '@gepick/utils'
import { generateBotsReportsTask } from '@gepick/tasks/src/generateReports'

async function generateBotsReports() {
  if (!cmd.dateFrom) {
    throw new Error('-df is required')
  }

  if (!cmd.period) {
    throw new Error('-pr is required')
  }

  await connectToDb()
  await generateBotsReportsTask(cmd.dateFrom, cmd.period)
}

export default generateBotsReports
