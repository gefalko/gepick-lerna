import { BetLabels } from './BetLabels'

interface IGoals {
  home: number
  away: number
}

export function isMatchWinnerBetWin(goals: IGoals, bet: string) {
  if (bet === BetLabels.MatchWinner.values.Home) {
    return goals.home > goals.away
  }
  if (bet === BetLabels.MatchWinner.values.Draw) {
    return goals.home === goals.away
  }
  if (bet === BetLabels.MatchWinner.values.Away) {
    return goals.home < goals.away
  }

  throw new Error('Bet is not correct: ' + bet)
}

export function isMatchUnderOverBetWin(goals: IGoals, bet: string) {
  const goalsSum = goals.home + goals.away

  if (bet === BetLabels.GoalsOverUnder.values.Under0_5) {
    return goalsSum < 0.5
  }

  if (bet === BetLabels.GoalsOverUnder.values.Over0_5) {
    return goalsSum > 0.5
  }

  if (bet === BetLabels.GoalsOverUnder.values.Under1_5) {
    return goalsSum < 1.5
  }

  if (bet === BetLabels.GoalsOverUnder.values.Over1_5) {
    return goalsSum > 1.5
  }

  if (bet === BetLabels.GoalsOverUnder.values.Under2_5) {
    return goalsSum < 2.5
  }

  if (bet === BetLabels.GoalsOverUnder.values.Over2_5) {
    return goalsSum > 2.5
  }

  if (bet === BetLabels.GoalsOverUnder.values.Under3_5) {
    return goalsSum < 3.5
  }

  if (bet === BetLabels.GoalsOverUnder.values.Over3_5) {
    return goalsSum > 3.5
  }

  if (bet === BetLabels.GoalsOverUnder.values.Under4_5) {
    return goalsSum < 4.5
  }

  if (bet === BetLabels.GoalsOverUnder.values.Over4_5) {
    return goalsSum > 4.5
  }
  if (bet === BetLabels.GoalsOverUnder.values.Under5_5) {
    return goalsSum < 5.5
  }

  if (bet === BetLabels.GoalsOverUnder.values.Over5_5) {
    return goalsSum > 5.5
  }
  if (bet === BetLabels.GoalsOverUnder.values.Under6_5) {
    return goalsSum < 6.5
  }

  if (bet === BetLabels.GoalsOverUnder.values.Over6_5) {
    return goalsSum > 6.5
  }

  throw new Error('Bet is not correct: ' + bet)
}

interface IIsBetWinArgs {
  goals: IGoals
  betLabelId: number
  bet: string
}

export function isBetWin(args: IIsBetWinArgs) {
  if (args.betLabelId === BetLabels.MatchWinner.apiFootballLabelId) {
    return isMatchWinnerBetWin(args.goals, args.bet)
  }

  if (args.betLabelId === BetLabels.GoalsOverUnder.apiFootballLabelId) {
    return isMatchUnderOverBetWin(args.goals, args.bet)
  }

  throw new Error('Not supported betLabel')
}
