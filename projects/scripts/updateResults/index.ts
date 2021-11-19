import { updatePicksStatus, updateMatchesResults } from '@gepick/tasks'
import { connectToDb } from '@gepick/database'

async function updateResultsAndPicksStatus() {
  await connectToDb()
  await updateMatchesResults()
  await updatePicksStatus()
}

export default updateResultsAndPicksStatus
