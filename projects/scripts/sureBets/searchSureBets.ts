import { connectToDb } from '@gepick/database'
import searchSureBetsTask from '@gepick/tasks/src/searchSureBets/searchSureBets'
import { cmd } from '@gepick/utils'

async function searchSureBets() {
  if (!cmd.day) {
    throw new Error('-d is required')
  }

  await connectToDb()

  await searchSureBetsTask(cmd.day)
}

export default searchSureBets
