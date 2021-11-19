import { findMatch, connectToDb } from '@gepick/database'
import { getTeamLastMatches } from '@gepick/api-football'
import { collectAndSaveMatches } from '@gepick/data-collector'
import { printlog, cmd } from '@gepick/utils'

if (cmd.matchId) {
  throw new Error('-mid is required!')
}

async function start() {
  await connectToDb()

  const targetMatch = await findMatch(
    { matchId: cmd.matchId! },
    {
      homeTeam: true,
      awayTeam: true,
    },
  )

  if (targetMatch) {
    const homeTeamLastMatches = await getTeamLastMatches(targetMatch.homeTeam.apiFootballTeamId, 20)
    const awayTeamLastMatches = await getTeamLastMatches(targetMatch.awayTeam.apiFootballTeamId, 20)

    await collectAndSaveMatches(homeTeamLastMatches)
    await collectAndSaveMatches(awayTeamLastMatches)
  } else {
    printlog('MATCH NOT EXIST', cmd.matchId)
  }
}

start()
