import { connectToDb } from '@gepick/database'
import { getSeasonLeagueMatches } from '@gepick/api-football'
import { collectAndSaveMatches } from '@gepick/data-collector'
import { cmd } from '@gepick/utils'

if (!cmd.seasonLeagueApiId) {
  throw new Error('--lid is required!')
}

async function start() {
  await connectToDb()

  const matches = await getSeasonLeagueMatches(cmd.seasonLeagueApiId!)

  await collectAndSaveMatches(matches)
}

start()
