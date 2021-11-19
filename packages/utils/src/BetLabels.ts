import { find } from 'lodash'

export enum BetLabelEnum {
  MatchWinner = 'MatchWinner',
  GoalsOverUnder = 'GoalsOverUnder',
}

export enum BetTypeEnum {
  HOME = 'home',
  DRAW = 'draw',
  AWAY = 'away',
  UNDER = 'under',
  OVER = 'over',
}

export enum BetLabelMatchWinnerValue {
  Home = 'Home',
  Draw = 'Draw',
  Away = 'Away',
}

export enum BetLabelGoalsUnderValue {
  Under0_5 = 'Under 0.5',
  Under1_5 = 'Under 1.5',
  Under2_5 = 'Under 2.5',
  Under3_5 = 'Under 3.5',
  Under4_5 = 'Under 4.5',
  Under5_5 = 'Under 5.5',
  Under6_5 = 'Under 6.5',
}

export enum BetLabelGoalsOverValue {
  Over0_5 = 'Over 0.5',
  Over1_5 = 'Over 1.5',
  Over2_5 = 'Over 2.5',
  Over3_5 = 'Over 3.5',
  Over4_5 = 'Over 4.5',
  Over5_5 = 'Over 5.5',
  Over6_5 = 'Over 6.5',
}

export enum BetLabelGoalsOverUnderValue {
  Under0_5 = 'Under 0.5',
  Over0_5 = 'Over 0.5',
  Under1_5 = 'Under 1.5',
  Over1_5 = 'Over 1.5',
  Under2_5 = 'Under 2.5',
  Over2_5 = 'Over 2.5',
  Under3_5 = 'Under 3.5',
  Over3_5 = 'Over 3.5',
  Under4_5 = 'Under 4.5',
  Over4_5 = 'Over 4.5',
  Under5_5 = 'Under 5.5',
  Over5_5 = 'Over 5.5',
  Under6_5 = 'Under 6.5',
  Over6_5 = 'Over 6.5',
}

export type MatchWinerBetKeysType = 'Home' | 'Draw' | 'Away'
export type GoalsOverUnderBetKeysType =
  | 'Under 0.5'
  | 'Over 0.5'
  | 'Under 1.5'
  | 'Over 1.5'
  | 'Under 2.5'
  | 'Over 2.5'
  | 'Under 3.5'
  | 'Over 3.5'
  | 'Under 4.5'
  | 'Over 4.5'
  | 'Under 5.5'
  | 'Over 5.5'
  | 'Under 6.5'
  | 'Over 6.5'

export type BetType = MatchWinerBetKeysType | GoalsOverUnderBetKeysType

export enum BetLabelIdEnum {
  MatchWinner = 1,
  GoalsOverUnder = 5,
}

export interface IBetLabelValues {
  [key: string]: string
}

export interface IBetLabel {
  apiFootballLabelId: BetLabelIdEnum
  name: string
  values: IBetLabelValues
}

export interface IBetLabels {
  [key: string]: IBetLabel
}

export const BetLabels: IBetLabels = {
  MatchWinner: {
    apiFootballLabelId: BetLabelIdEnum.MatchWinner,
    name: 'Match Winner',
    values: BetLabelMatchWinnerValue,
  },
  GoalsOverUnder: {
    apiFootballLabelId: BetLabelIdEnum.GoalsOverUnder,
    name: 'Goals Over/Under',
    values: BetLabelGoalsOverUnderValue,
  },
}

export function getBetLabelByLabelId(betLabelId: BetLabelIdEnum) {
  return find(BetLabels, (betLabel) => {
    return betLabel.apiFootballLabelId === betLabelId
  })
}
