import * as mongoose from 'mongoose'
import * as moment from 'moment'
import { ObjectId } from 'bson'
import { toGepickOneDayInterval } from '@gepick/utils/src/dates'
import MatchModel, { Match } from '../../models/match/MatchModel'
import { MatchStatusEnum } from '../../types'

export interface IMatch {
  _id: string
}

export async function apiFootbalMatchExistByFixtureId(fixtureId: number) {
  const dbMatch = await MatchModel.findOne({
    apiFootballFixtureId: fixtureId,
  })

  return dbMatch !== null
}

export async function findMatchByFixtureId(fixtureId: number) {
  const dbMatch = await MatchModel.findOne({
    apiFootballFixtureId: fixtureId,
  })

  return dbMatch
}

interface IFindMatchesArgs {
  search: {
    day?: string
    seasionApiFootballLeagueId?: number
  }
}

export async function findMatches(args: IFindMatchesArgs) {
  const dbMatches = await MatchModel.find(args.search)

  return dbMatches
}

interface IFindMatchArgs {
  matchId: string
  historicalDeep?: number
}

export interface IMatchPopulateOptions {
  homeTeam?: boolean
  awayTeam?: boolean
  league?: boolean
  country?: boolean
}

function getPopulationObject(populate?: IMatchPopulateOptions) {
  const result = []

  if (populate?.homeTeam) {
    result.push({
      path: 'homeTeam',
    })
  }

  if (populate?.awayTeam) {
    result.push({
      path: 'awayTeam',
    })
  }

  if (populate?.league) {
    result.push({
      path: 'league',
    })
  }

  if (populate?.country) {
    result.push({
      path: 'country',
    })
  }

  return result
}

export async function findMatch(args: IFindMatchArgs, populate?: IMatchPopulateOptions) {
  const dbMatch = await MatchModel.findOne({
    _id: args.matchId,
  }).populate(getPopulationObject(populate))

  return dbMatch
}

export async function findMatchById(matchId: string) {
  return findMatch({ matchId })
}

export async function findMatchesById(matchIds: string[], populate?: IMatchPopulateOptions): Promise<Match[]> {
  const ids = matchIds.map((id): ObjectId => mongoose.Types.ObjectId(id))
  console.time('test')
  const matches = await MatchModel.find({
    _id: { $in: ids },
  }).populate(getPopulationObject(populate))
  console.timeEnd('test')

  return matches
}

interface IGetHistoricalMatchesMatch_Team {
  _id: string
}

export interface IGetHistoricalMatches_Match {
  startTime: Date
  homeTeam: IGetHistoricalMatchesMatch_Team
  awayTeam: IGetHistoricalMatchesMatch_Team
}

export async function getHistoricalMatches(match: IGetHistoricalMatches_Match) {
  try {
    if (!match.homeTeam?._id || !match.awayTeam?._id) {
      throw new Error('Teams not populated')
    }

    const homeHistoricalMatches = await MatchModel.find({
      $or: [{ homeTeam: match.homeTeam._id }, { awayTeam: match.homeTeam._id }],
      startTime: {
        $lt: match.startTime,
      },
    } as any)

    const awayHistoricalMatches = await MatchModel.find({
      $or: [{ homeTeam: match.awayTeam._id }, { awayTeam: match.awayTeam._id }],
      startTime: {
        $lt: match.startTime,
      },
    } as any)

    return {
      home: homeHistoricalMatches,
      away: awayHistoricalMatches,
    }
  } catch (err) {
    throw new Error('Error on gepick getHistoricalMatches function')
  }
}

interface IFindMatchesByDayProps {
  day: string
  populateOptions?: IMatchPopulateOptions
  offset?: number
  limit?: number
}

export async function findMatchesByDay(props: IFindMatchesByDayProps) {
  const { fromDatetime, toDatetime } = toGepickOneDayInterval(props.day)

  const matches = await MatchModel.find({
    startTime: {
      $gte: fromDatetime.toDate(),
      $lt: toDatetime.toDate(),
    },
  })
    .populate(getPopulationObject(props.populateOptions))
    .skip(props.offset ?? 0)
    .limit(props.limit ?? 10000)

  return matches
}

interface IFindMatchesByWeekProps {
  year: number
  yearWeek: number
  populateOptions?: IMatchPopulateOptions
  offset?: number
  limit?: number
}

export async function findMatchesByWeek(props: IFindMatchesByWeekProps) {
  const monday = moment().day('Monday').year(props.year).isoWeek(props.yearWeek).format('YYYY-MM-DD')
  const sunday = moment().day('Sunday').year(props.year).isoWeek(props.yearWeek).format('YYYY-MM-DD')

  const { fromDatetime } = toGepickOneDayInterval(monday)
  const { toDatetime } = toGepickOneDayInterval(sunday)

  const matches = await MatchModel.find({
    startTime: {
      $gte: fromDatetime.toDate(),
      $lt: toDatetime.toDate(),
    },
  })
    .populate(getPopulationObject(props.populateOptions))
    .skip(props.offset ?? 0)
    .limit(props.limit ?? 50000)

  return matches
}

export async function findNotStartedMatches(populate?: IMatchPopulateOptions) {
  const matches = await MatchModel.find({
    status: MatchStatusEnum.NOT_STARTED,
  }).populate(getPopulationObject(populate))

  return matches
}

export async function findNotFinishedMatches(populate?: IMatchPopulateOptions) {
  const matches = await MatchModel.find({
    $or: [
      { status: MatchStatusEnum.NOT_STARTED },
      { status: MatchStatusEnum.FIRST_HALF },
      { status: MatchStatusEnum.SECOND_HALF },
      { status: MatchStatusEnum.HALFTIME },
      { status: MatchStatusEnum.TIME_TO_BE_DEFINED },
    ],
  }).populate(getPopulationObject(populate))

  return matches
}
