export enum MatchStatusEnum {
  BROKEN = 'BROKEN',
  CANCELED = 'CANCELED',
  POSTPONED = 'POSTPONED',
  SUSPENDED = 'SUSPENDED',
  FINISHED = 'FINISHED',
  HALFTIME = 'HALFTIME',
  FINISHED_EXTRA_TIME = 'FINISHED_EXTRA_TIME',
  FINISHED_PENELTIES = 'FINISHED_PENELTIES',
  SECOND_HALF = 'SECOND_HALF',
  FIRST_HALF = 'FIRST_HALF',
  NOT_STARTED = 'NOT_STARTED',
  TIME_TO_BE_DEFINED = 'TIME_TO_BE_DEFINED',
  TECHNICAL_LOSS = 'TECHNICAL_LOSS',
  WALKOVER = 'WALKOVER',
  EXTRA_TIME = 'EXTRA_TIME',
  MATCH_ABANDONED = 'MATCH_ABANDONED',
}

export interface IMatchBase {
  apiFootballFixtureId: number
  startTime: string
  homeTeam: string
  homeTeamName: string
  awayTeam: string
  awayTeamName: string
  league: string
  leagueName: string
  country: string
  countryName: string
  goalsHomeTeam?: number
  awayTeamGoals?: number
  status: MatchStatusEnum
  score: {
    halftime?: string
    fulltime?: string
    extratime?: string
    penalty?: string
  }
}

export interface IFootbalApiMatch extends IMatchBase {
  id: string
}

export interface ITeamBase {
  apiFootballTeamId: number
  country?: string
  countryName?: string
  countryCode?: string
  name: string
  isNational: boolean
  founded?: number
  code?: string
  logo?: string
  vanueName?: string
  vanueSurface?: string
  vanueAddress?: string
  vanueCity?: string
  vanueCapacity?: number
}

export interface ITeam extends ITeamBase {
  _id: string
}

export enum LeagueTypeEnum {
  LEAGUE = 'LEAGUE',
  CUP = 'CUP',
}

export enum SeasonEnum {
  S2010 = 2010,
  S2011 = 2011,
  S2012 = 2012,
  S2013 = 2013,
  S2014 = 2014,
  S2015 = 2015,
  S2016 = 2016,
  S2017 = 2017,
  S2018 = 2018,
  S2019 = 2019,
  S2020 = 2020,
  S2021 = 2021,
}

export interface ILeagueBase {
  apiFootballLeagueId: number
  name: string
  type: LeagueTypeEnum
  country: string
  countryName: string
  countryCode?: string
  season: SeasonEnum
  seasonStart: string
  seasonEnd: string
  isCurrent: boolean
  logo?: string
  flag?: string
  standings?: number
  apiFootballCoverage?: {
    standings: boolean
    fixtures: {
      events: boolean
      lineups: boolean
      statistics: boolean
      players_statistics: boolean
    }
    players: boolean
    topScorers: boolean
    predictions: boolean
    odds: boolean
  }
}

export interface ILeague extends ILeagueBase {
  _id: string
}

export interface ICountryBase {
  name: string
  code?: string
  flag?: string
}

export enum PickStatusEnum {
  PENDING = 'PENDING',
  CORRECT = 'CORRECT',
  NOT_CORRECT = 'NOT_CORRECT',
  CANCELED = 'CANCELED',
}
