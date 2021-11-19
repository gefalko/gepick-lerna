import { getDayMatches } from '@gepick/api-football'
import { bannedCountriesList } from '@gepick/utils'
import { collectAndSaveMatches } from '@gepick/data-collector'

export async function collectDayMatches(day: string) {
  const matches = await getDayMatches(day)

  const filteredMatches = matches.filter((match) => {
    return !bannedCountriesList.includes(match.league.country)
  })

  await collectAndSaveMatches(filteredMatches)
}

