import { connectToDb } from '@gepick/database'
import { updateMatchesResults } from '@gepick/tasks'

async function main() {
  await connectToDb()
  await updateMatchesResults()
}

main()
