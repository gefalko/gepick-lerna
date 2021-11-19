import { connectToDb } from '@gepick/database'
import { updatePicksStatus } from '@gepick/tasks'

async function main() {
  await connectToDb()
  await updatePicksStatus()
}

main()
