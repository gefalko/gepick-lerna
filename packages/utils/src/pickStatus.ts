import { round } from 'lodash'
import { MatchStatusEnum, PickStatusEnum } from '@gepick/database/src/types'
import { BetLabelMatchWinnerValue, BetLabelGoalsOverUnderValue, BetLabels } from './BetLabels'
import { isMatchPending, isMatchCanceled } from './matchStatus'

interface IMatch {
  _id?: string
  status: MatchStatusEnum
  goalsHomeTeam?: number | null
  goalsAwayTeam?: number | null
}

function setMatchWinerPickStatus(match: IMatch, bet: string) {
  if (typeof match === 'string') {
    throw new Error('Match is not populated!')
  }

  if (!match) {
    throw new Error('Match is not defined!')
  }

  const { goalsHomeTeam, goalsAwayTeam } = match

  if (goalsHomeTeam != null && goalsAwayTeam != null) {
    if (bet === BetLabelMatchWinnerValue.Home) {
      if (goalsHomeTeam > goalsAwayTeam) {
        return PickStatusEnum.CORRECT
      }

      return PickStatusEnum.NOT_CORRECT
    }

    if (bet === BetLabelMatchWinnerValue.Draw) {
      if (goalsHomeTeam === goalsAwayTeam) {
        return PickStatusEnum.CORRECT
      }
      return PickStatusEnum.NOT_CORRECT
    }

    if (bet === BetLabelMatchWinnerValue.Away) {
      if (goalsHomeTeam < goalsAwayTeam) {
        return PickStatusEnum.CORRECT
      }

      return PickStatusEnum.NOT_CORRECT
    }
  } else {
    throw new Error('Goals is undefined')
  }

  throw new Error('Bet not exist:' + bet)
}

function setGoalsOverUnderPickStatus(match: IMatch, bet: string) {
  if (typeof match === 'string') {
    throw new Error('Match is not populated!')
  }

  if (match == null) {
    throw new Error('Match is not defined!')
  }

  if (match.goalsHomeTeam == null || match.goalsAwayTeam == null) {
    throw new Error('Match goals is undefined1')
  }

  const goalsSum = match.goalsHomeTeam + match.goalsAwayTeam

  function isUnder(under: number) {
    if (goalsSum < under) {
      return PickStatusEnum.CORRECT
    }

    return PickStatusEnum.NOT_CORRECT
  }

  function isOver(over: number) {
    if (goalsSum > over) {
      return PickStatusEnum.CORRECT
    }

    return PickStatusEnum.NOT_CORRECT
  }

  if (bet === BetLabelGoalsOverUnderValue.Under0_5) {
    return isUnder(0.5)
  }

  if (bet === BetLabelGoalsOverUnderValue.Over0_5) {
    return isOver(0.5)
  }

  if (bet === BetLabelGoalsOverUnderValue.Under1_5) {
    return isUnder(1.5)
  }

  if (bet === BetLabelGoalsOverUnderValue.Over1_5) {
    return isOver(1.5)
  }

  if (bet === BetLabelGoalsOverUnderValue.Under2_5) {
    return isUnder(2.5)
  }

  if (bet === BetLabelGoalsOverUnderValue.Over2_5) {
    return isOver(2.5)
  }

  if (bet === BetLabelGoalsOverUnderValue.Under3_5) {
    return isUnder(3.5)
  }

  if (bet === BetLabelGoalsOverUnderValue.Over3_5) {
    return isOver(3.5)
  }

  if (bet === BetLabelGoalsOverUnderValue.Under4_5) {
    return isUnder(4.5)
  }

  if (bet === BetLabelGoalsOverUnderValue.Over4_5) {
    return isOver(4.5)
  }

  if (bet === BetLabelGoalsOverUnderValue.Under5_5) {
    return isUnder(5.5)
  }

  if (bet === BetLabelGoalsOverUnderValue.Over5_5) {
    return isOver(5.5)
  }
  if (bet === BetLabelGoalsOverUnderValue.Under6_5) {
    return isUnder(6.5)
  }

  if (bet === BetLabelGoalsOverUnderValue.Over6_5) {
    return isOver(6.5)
  }

  throw new Error('Bet not exist')
}

export function setPickStatus(match: IMatch | string, betLabelId: number, bet: string) {
  if (typeof match === 'string') {
    throw new Error('Match is not populated!')
  }

  if (isMatchPending(match?.status)) {
    return PickStatusEnum.PENDING
  }

  if (isMatchCanceled(match?.status as MatchStatusEnum)) {
    return PickStatusEnum.CANCELED
  }

  if (match?.goalsHomeTeam == null || match?.goalsAwayTeam == null) {
    throw new Error('Match not have results! match:' + match._id)
  }

  if (betLabelId === BetLabels.MatchWinner.apiFootballLabelId) {
    return setMatchWinerPickStatus(match, bet)
  }

  if (betLabelId === BetLabels.GoalsOverUnder.apiFootballLabelId) {
    return setGoalsOverUnderPickStatus(match, bet)
  }

  throw new Error('Not suported bet label:' + betLabelId)
}

export function setPickProfit(oddSize: number, status: PickStatusEnum) {
  if (status === PickStatusEnum.CORRECT) {
    return round(oddSize - 1, 2)
  }

  if (status === PickStatusEnum.NOT_CORRECT) {
    return -1
  }

  return undefined
}
