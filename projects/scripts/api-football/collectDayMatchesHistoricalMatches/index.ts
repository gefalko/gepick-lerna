import { connectToDb } from '@gepick/database'
import { cmd } from '@gepick/utils'
import collectDayMatchesHistoricalMatches from '@gepick/tasks/src/collectDayMatchesHistoricalMatches/collectDayMatchesHistoricalMatches'

async function start() {
  if (!cmd.day) {
    throw new Error('-d is required')
  }

  await connectToDb()

  await collectDayMatchesHistoricalMatches(cmd.day, cmd.index)
}

export default start
