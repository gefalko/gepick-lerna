import { MatchStatusEnum } from '@gepick/database/src/types'

export type Bet = 'home' | 'draw' | 'away' | 'under' | 'over'

interface IOddBetValue {
  odd: number
  value: string
}

export interface IOddBet {
  labelId: number
  value: IOddBetValue[]
}

export interface IBookmakerOdds {
  _id: string
  bookmakerId: number
  bets: IOddBet[]
}

export interface IMatch {
  startTime: Date
  _id: string
  status: MatchStatusEnum
  niceStatus: string
  leagueName: string
  countryName: string
  homeTeamName: string
  awayTeamName: string
  goalsHomeTeam: number | null
  goalsAwayTeam: number | null
}
