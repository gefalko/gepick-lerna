import { connectToDb } from '@gepick/database'
import { cmd } from '@gepick/utils'
import collectDayMatchesOdds from '@gepick/tasks/src/collectDayMatchesOdds/collectDayMatchesOdds'

async function start() {
  if (!cmd.day) {
    throw new Error('-d is required')
  }

  await connectToDb()
  await collectDayMatchesOdds(cmd.day)
}

export default start
