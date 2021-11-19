import { round, sumBy } from 'lodash'
import { PickStatusEnum } from '@gepick/utils/src/PickStatusEnum'

interface ICalculatePicksStatisticPick {
  status: PickStatusEnum
  odd: number
}

interface ICalculatePicksStatisticArgs {
  picks: (ICalculatePicksStatisticPick | undefined)[]
}

function calculateTotalProfit(picks: ICalculatePicksStatisticArgs['picks']) {
  const profit = picks.reduce((currentProfit, picksItem) => {
    if (
      !picksItem ||
      !picksItem.odd ||
      picksItem.status === PickStatusEnum.PENDING ||
      picksItem.status === PickStatusEnum.CANCELED
    ) {
      return currentProfit
    }

    if (picksItem.status === PickStatusEnum.NOT_CORRECT) {
      return currentProfit - 1
    }

    return currentProfit + (picksItem.odd - 1)
  }, 0)

  return round(profit, 2)
}

function calculateAverageOdd(picks: ICalculatePicksStatisticArgs['picks']) {
  if (picks.length === 0) {
    return 0
  }

  const oddsSum = sumBy(picks, 'odd')

  return round(oddsSum / picks.length, 2)
}

function calculatePicksStatistic(args: ICalculatePicksStatisticArgs) {
  const finishedPicks = args.picks.filter((picksItem) => {
    if (picksItem == null) {
      return false
    }

    return picksItem.status !== PickStatusEnum.PENDING && picksItem.status !== PickStatusEnum.CANCELED
  })

  const correctPicks = finishedPicks.filter((finishedPicksItem) => {
    if (finishedPicksItem == null) {
      return false
    }

    return finishedPicksItem.status === PickStatusEnum.CORRECT
  })

  const total = args.picks.length
  const totalFinished = finishedPicks.length
  const totalCorrect = correctPicks.length
  const totalNotCorrect = totalFinished - totalCorrect
  const totalProfit = calculateTotalProfit(finishedPicks)
  const profitPerPick = totalFinished > 0 ? round(totalProfit / totalFinished, 2) : 0
  const averageOdd = calculateAverageOdd(args.picks)
  const correctAverageOdd = calculateAverageOdd(correctPicks)

  return {
    total,
    totalFinished,
    totalCorrect,
    totalNotCorrect,
    totalProfit,
    profitPerPick,
    averageOdd,
    correctAverageOdd,
  }
}

export default calculatePicksStatistic
