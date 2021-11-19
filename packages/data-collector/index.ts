import {
  apiFootbalMatchExistByFixtureId,
  findTeamByApiFootballTeamId,
  findLeagueByApiFootballLeagueId,
  saveCountry,
  saveLeague,
  saveMatch,
  saveTeam,
  findLeague,
} from '@gepick/database'
import {  findCountryByName } from '@gepick/database/src/models/country/functions'
import { getLeagueById, getCountryByName, getTeamById } from '@gepick/api-football'
import { IFixture, ILeague as IApiLeague } from '@gepick/api-football/types'
import { LeagueTypeEnum, MatchStatusEnum } from '@gepick/database/src/types'
import { printlog, bannedCountriesList } from '@gepick/utils'
import { TeamCountryIsBannedError } from './errors'

function formatLeagueType(apiFootballType: string) {
  if (apiFootballType === 'Cup') {
    return LeagueTypeEnum.CUP
  }

  if (apiFootballType === 'League') {
    return LeagueTypeEnum.LEAGUE
  }

  throw new Error(`Not supported league type: ${apiFootballType}`)
}

async function findOrCollectAndCreateCountry(countryName: string) {
  const dbCountry = await findCountryByName(countryName)

  if (dbCountry) {
    return dbCountry
  }

  const apiFootballCountry = await getCountryByName(countryName)

  if (!apiFootballCountry) {
    if (bannedCountriesList.includes(countryName)) {
      throw new TeamCountryIsBannedError(countryName)
    }

    throw new Error(`Country ${countryName} not exist on api-football.`)
  }

  const newCountry = await saveCountry({
    name: apiFootballCountry.country,
    code: apiFootballCountry.code,
    flag: apiFootballCountry.flag,
  })

  return newCountry
}

export async function findOrCreateLeague(apiLeague: IApiLeague) {
  const dbLeague = await findLeague({
    countryName: apiLeague.country,
    leagueName: apiLeague.name,
  })

  if (dbLeague) {
    return dbLeague
  }

  const country = await findOrCollectAndCreateCountry(apiLeague.country)

  const season = {
    season: apiLeague.season,
    seasonStart: apiLeague.season_start,
    seasonEnd: apiLeague.season_end,
    standings: apiLeague.standings,
    apiFootballCoverage: apiLeague.coverage,
    apiFootballLeagueId: apiLeague.league_id,
  }

  const newDbLeague = await saveLeague({
    name: apiLeague.name,
    type: formatLeagueType(apiLeague.type),
    country: country._id!,
    countryName: country.name!,
    countryCode: country.code,
    logo: apiLeague.logo ?? undefined,
    flag: apiLeague.flag,
    seasons: [season],
  })

  return newDbLeague
}

async function findOrCollectAndCreateLeague(apiFootballLeagueId: number) {
  const dbLeague = await findLeagueByApiFootballLeagueId(apiFootballLeagueId)

  if (dbLeague) {
    return dbLeague
  }

  const apiFootballLeague = await getLeagueById(apiFootballLeagueId)

  const newDbLeague = await findOrCreateLeague(apiFootballLeague)

  return newDbLeague
}

async function findOrCollectAndCreateTeam(apiFootbalTeamId: number) {
  const dbTeam = await findTeamByApiFootballTeamId(apiFootbalTeamId)

  if (dbTeam) {
    return dbTeam
  }

  const apiFootballTeam = await getTeamById(apiFootbalTeamId)

  const country = apiFootballTeam.country ? await findOrCollectAndCreateCountry(apiFootballTeam.country) : undefined

  const newDbTeam = await saveTeam({
    apiFootballTeamId: apiFootballTeam.team_id,
    country: country?._id,
    countryName: country?.name,
    countryCode: country?.code,
    name: apiFootballTeam.name,
    isNational: apiFootballTeam.is_national,
    founded: apiFootballTeam.founded,
    code: apiFootballTeam.code,
    logo: apiFootballTeam.logo,
    vanueName: apiFootballTeam.venue_name,
    vanueSurface: apiFootballTeam.venue_surface,
    vanueAddress: apiFootballTeam.venue_address,
    vanueCity: apiFootballTeam.venue_city,
    vanueCapacity: apiFootballTeam.venue_capacity,
  })

  return newDbTeam
}

export function formatMatchStatus(apiFootballMatchStatus: string) {
  if (apiFootballMatchStatus === 'BROKEN') {
    return { status: MatchStatusEnum.BROKEN, niceStatus: 'broken' }
  }

  if (apiFootballMatchStatus === 'HT') {
    return { status: MatchStatusEnum.HALFTIME, niceStatus: 'halftime' }
  }

  if (apiFootballMatchStatus === 'NS') {
    return { status: MatchStatusEnum.NOT_STARTED, niceStatus: 'not started' }
  }

  if (apiFootballMatchStatus === 'CANC' || apiFootballMatchStatus === 'Canc') {
    return { status: MatchStatusEnum.CANCELED, niceStatus: 'canceled' }
  }

  if (apiFootballMatchStatus === 'PST') {
    return { status: MatchStatusEnum.POSTPONED, niceStatus: 'postponed' }
  }

  if (apiFootballMatchStatus === 'FT') {
    return { status: MatchStatusEnum.FINISHED, niceStatus: 'finished' }
  }

  if (apiFootballMatchStatus === 'AET') {
    return { status: MatchStatusEnum.FINISHED_EXTRA_TIME, niceStatus: 'finished (extra time)' }
  }

  if (apiFootballMatchStatus === 'PEN') {
    return { status: MatchStatusEnum.FINISHED_PENELTIES, niceStatus: 'finished (penelties)' }
  }

  if (apiFootballMatchStatus === '1H') {
    return { status: MatchStatusEnum.FIRST_HALF, niceStatus: '1st half' }
  }

  if (apiFootballMatchStatus === '2H') {
    return { status: MatchStatusEnum.SECOND_HALF, niceStatus: '2n half' }
  }

  if (apiFootballMatchStatus === 'TBD') {
    return { status: MatchStatusEnum.TIME_TO_BE_DEFINED, niceStatus: 'time to be defined' }
  }

  if (apiFootballMatchStatus === 'AWD') {
    return { status: MatchStatusEnum.TECHNICAL_LOSS, niceStatus: 'technical loss' }
  }

  if (apiFootballMatchStatus === 'WO') {
    return { status: MatchStatusEnum.WALKOVER, niceStatus: 'Walkover' }
  }

  if (apiFootballMatchStatus === 'ET') {
    return { status: MatchStatusEnum.EXTRA_TIME, niceStatus: 'Extra time' }
  }

  if (apiFootballMatchStatus === 'SUSP') {
    return { status: MatchStatusEnum.EXTRA_TIME, niceStatus: 'Suspended' }
  }

  if (apiFootballMatchStatus === 'ABD') {
    return { status: MatchStatusEnum.MATCH_ABANDONED, niceStatus: 'Match Abandoned' }
  }

  throw new Error(`Not supported api-football match status: ${apiFootballMatchStatus}`)
}

export async function collectAndSaveMatch(apiFootballMatch: IFixture) {
  if (await apiFootbalMatchExistByFixtureId(apiFootballMatch.fixture_id)) {
    printlog('match exist:', apiFootballMatch.fixture_id)
    return
  }

  const homeTeam = (await findOrCollectAndCreateTeam(apiFootballMatch.homeTeam.team_id)).toObject()
  const awayTeam = (await findOrCollectAndCreateTeam(apiFootballMatch.awayTeam.team_id)).toObject()
  const league = (await findOrCollectAndCreateLeague(apiFootballMatch.league_id)).toObject()
  const country = league.countryName ? (await findOrCollectAndCreateCountry(league.countryName)).toObject() : undefined

  const formatedScore = apiFootballMatch.score
    ? {
        halftime: apiFootballMatch.score.halftime,
        fulltime: apiFootballMatch.score.fulltime,
        extratime: apiFootballMatch.score.extratime,
        penalty: apiFootballMatch.score.penalty,
      }
    : undefined

  const formatedStatus = formatMatchStatus(apiFootballMatch.statusShort)

  await saveMatch({
    apiFootballFixtureId: apiFootballMatch.fixture_id,
    startTime: new Date(apiFootballMatch.event_date),
    homeTeam,
    awayTeam,
    homeTeamName: homeTeam.name,
    awayTeamName: awayTeam.name,
    league,
    leagueName: league.name,
    seasionApiFootballLeagueId: apiFootballMatch.league_id,
    country,
    countryName: country?.name ?? undefined,
    goalsHomeTeam: apiFootballMatch.goalsHomeTeam ?? undefined,
    goalsAwayTeam: apiFootballMatch.goalsAwayTeam ?? undefined,
    status: formatedStatus.status,
    niceStatus: formatedStatus.niceStatus,
    score: formatedScore,
  })
}

export async function collectAndSaveMatches(apiFootbalMatches: IFixture[]) {
  for (let i = 0; i < apiFootbalMatches.length; i++) {
    printlog('collectAndSaveMatches: ' + i + '/' + apiFootbalMatches.length)

    const match = apiFootbalMatches[i]
    try {
      await collectAndSaveMatch(match)
    } catch (err) {
      if (err instanceof TeamCountryIsBannedError) {
        printlog(err)
      } else {
        throw err
      }
    }
  }
}
