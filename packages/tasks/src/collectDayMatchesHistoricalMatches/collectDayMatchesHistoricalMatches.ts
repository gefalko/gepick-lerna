import { findMatchesByDay } from '@gepick/database'
import { getTeamLastMatches } from '@gepick/api-football'
import { ILastFixturesFromTeamIdResponse_Fixture } from '@gepick/api-football/types'
import { collectAndSaveMatches } from '@gepick/data-collector'
import { bannedCountriesList, printlog } from '@gepick/utils'

async function collectDayMatchesHistoricalMatches(day: string, startIndex = 0) {
  const dbMatches = await findMatchesByDay({ day, populateOptions: { homeTeam: true, awayTeam: true } })

  for (let i = startIndex; i < dbMatches.length; i++) {
    printlog('collectDayMatchesHistoricalMatches ' + i + '/' + dbMatches.length)

    const dbMatch = dbMatches[i]

    const bannedCoutriesFilter = (apiFootballMatch: ILastFixturesFromTeamIdResponse_Fixture) => {
      return !bannedCountriesList.includes(apiFootballMatch.league.country)
    }

    const homeTeamLastMatches = await getTeamLastMatches(dbMatch.homeTeam.apiFootballTeamId, 10)
    const awayTeamLastMatches = await getTeamLastMatches(dbMatch.awayTeam.apiFootballTeamId, 10)

    await collectAndSaveMatches(homeTeamLastMatches.filter(bannedCoutriesFilter))
    await collectAndSaveMatches(awayTeamLastMatches.filter(bannedCoutriesFilter))
  }
}

export default collectDayMatchesHistoricalMatches
