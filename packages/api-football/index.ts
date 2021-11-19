import axios from 'axios'
import { printlog } from '@gepick/utils'
import { BetLabelIdEnum } from '@gepick/utils/src/BetLabels'
import {
  IFixturesFromOneDayResponse,
  ILeaguesByIdResponse,
  ITeamByIdResponse,
  ICountriesAvailableResponse,
  ILastFixturesFromTeamIdResponse,
  IOddsByFixtureIdResponse,
  IMatchByFixtureIdResponse,
  ILeaguesBySeasonResponse,
  IFixturesByLeagueResponse,
  IDayOddsResponse,
} from './types'

async function getData<T>(query: string, params: object = {}, errorCount = 0): Promise<T> {
  try {
    const url = `https://api-football-v1.p.rapidapi.com/v2/${query}`
    printlog('Request(' + errorCount + '):', url)

    const res = await axios({
      method: 'GET',
      url,
      headers: {
        'content-type': 'application/octet-stream',
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
        'x-rapidapi-key': '6da6144181mshf1e7a2dfd06b8c9p1aa7dajsnceb3d8f116cc',
        params,
      },
    })

    return res.data
  } catch (err) {
    if (errorCount < 5) {
      return getData(query, params, errorCount + 1)
    }
    throw err
  }
}

interface IGetDataV3Args<Q> {
  query: Q
  path: string
  errorCount?: number
}

async function getDataV3<T, Q>(args: IGetDataV3Args<Q>): Promise<T> {
  try {
    const url = `https://api-football-v1.p.rapidapi.com/v3/${args.path}`
    printlog('Request(' + args.errorCount + '):', url)

    const res = await axios({
      method: 'GET',
      url,
      headers: {
        'x-rapidapi-key': '6da6144181mshf1e7a2dfd06b8c9p1aa7dajsnceb3d8f116cc',
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
        useQueryString: true,
      },
      params: args.query,
    })

    return res.data
  } catch (err) {
    if (args.errorCount ?? 0 < 5) {
      return getDataV3({
        path: args.path,
        query: args.query,
        errorCount: (args.errorCount ?? 0) + 1,
      })
    }
    throw err
  }
}

interface IGetDayBetOddsOddsArgs {
  day: string
  betLabelId?: BetLabelIdEnum
}

interface IGetDayBetOddsOddsQuery {
  date: string
  page: number
  bet?: BetLabelIdEnum
}

export async function getDayBetOddsByDay(args: IGetDayBetOddsOddsArgs) {
  const fetch = async (page: number) => {
    const result = await getDataV3<IDayOddsResponse, IGetDayBetOddsOddsQuery>({
      path: 'odds',
      query: {
        date: args.day,
        page,
        bet: args.betLabelId,
      },
    })

    return result
  }

  const firstPage = await fetch(1)
  let odds = [...firstPage.response]

  for (let i = 2; i <= firstPage.paging.total; i++) {
    const pageResult = await fetch(i)

    odds = [...odds, ...pageResult.response]
  }

  return odds
}

export async function getDayMatches(day: string) {
  const result = await getData<IFixturesFromOneDayResponse>(`fixtures/date/${day}`, {
    timezone: 'Europe%2FLondon',
  })

  return result.api.fixtures
}

export async function getLeagueById(id: number) {
  const res = await getData<ILeaguesByIdResponse>(`leagues/league/${id}`)

  return res.api.leagues[0]
}

export async function getTeamById(id: number) {
  const results = await getData<ITeamByIdResponse>(`teams/team/${id}`)

  return results.api.teams[0]
}

export function getMatchOddsByMatchId(id: number) {
  return getData<ITeamByIdResponse>(`odds/fixture/${id}`)
}

export async function getCountryByName(countryName: string) {
  const res = await getData<ICountriesAvailableResponse>(`countries`)

  const country = res.api.countries.find((cCountry) => cCountry.country === countryName)

  return country
}

export async function getTeamLastMatches(apiFootballTeamId: number, deep: number) {
  const res = await getData<ILastFixturesFromTeamIdResponse>(`fixtures/team/${apiFootballTeamId}/last/${deep}`)

  return res.api.fixtures
}

export async function getOddsByFixtureId(fixtureId: number) {
  const result = await getData<IOddsByFixtureIdResponse>(`odds/fixture/${fixtureId}`)

  return result.api.odds
}

export async function getMatchByFixtureId(fixtureId: number) {
  const result = await getData<IMatchByFixtureIdResponse>(`fixtures/id/${fixtureId}`)

  if (result.api.results === 0) {
    return null
  }

  return result.api.fixtures[0]
}

export async function getLeaguesBySeason(season: number) {
  const results = await getData<ILeaguesBySeasonResponse>(`leagues/season/${season}`)

  return results.api.leagues
}

export async function getSeasonLeagueMatches(seasonLeagueId: number) {
  const results = await getData<IFixturesByLeagueResponse>(`fixtures/league/${seasonLeagueId}`)

  return results.api.fixtures
}
