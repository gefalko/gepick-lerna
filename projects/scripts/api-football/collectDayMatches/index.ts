import { connectToDb } from '@gepick/database'
import { getDayMatches } from '@gepick/api-football'
import { collectAndSaveMatches } from '@gepick/data-collector'
import { bannedCountriesList, cmd } from '@gepick/utils'

async function start() {
  if (!cmd.day) {
    throw new Error('-d is required')
  }

  await connectToDb()

  const matches = await getDayMatches(cmd.day!)

  const filteredMatches = matches.filter((match) => {
    return !bannedCountriesList.includes(match.league.country)
  })

  await collectAndSaveMatches(filteredMatches)
}

export default start
