import { connectToDb, Season, pushSeason } from '@gepick/database'
import { findOrCreateLeague } from '@gepick/data-collector'
import { getLeaguesBySeason } from '@gepick/api-football'
import { bannedCountriesList, cmd } from '@gepick/utils'

if (!cmd.season) {
  throw new Error('--se is required!')
}

async function start() {
  await connectToDb()

  const apiLeagues = await getLeaguesBySeason(cmd.season!)

  const filteredLeagues = apiLeagues.filter((league) => {
    return !bannedCountriesList.includes(league.country)
  })

  for (const leagueSeason of filteredLeagues) {
    const dbLeague = await findOrCreateLeague(leagueSeason)

    if (dbLeague?.seasons) {
      const seasion = dbLeague.seasons.find((seasionTmp: Season) => {
        return seasionTmp.season === leagueSeason.season
      })

      if (!seasion) {
        await pushSeason(dbLeague._id, {
          season: leagueSeason.season,
          seasonStart: leagueSeason.season_start,
          seasonEnd: leagueSeason.season_end,
          standings: leagueSeason.standings,
          apiFootballCoverage: leagueSeason.coverage,
          apiFootballLeagueId: leagueSeason.league_id,
        })
      }
    }
  }
}

start()
