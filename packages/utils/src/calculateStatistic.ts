import { Match } from '@gepick/database'
import { sumBy, round } from 'lodash'
import { isMatchFinished, isBetWin } from '@gepick/utils'
import { BetLabelIdEnum } from './BetLabels'

interface IOdd {
  oddSize: number
  matchId: string
}

interface ICalculateStatisticArgs {
  matches: Match[]
  betLabelId: BetLabelIdEnum
  bet: string
  odds: IOdd[]
}

export function calculateStatistic(args: ICalculateStatisticArgs) {
  const matchesWithResult = args.matches.filter((matchItem) => {
    return isMatchFinished(matchItem.status)
  })

  const correctMatches = matchesWithResult.filter((matchesWithResultItem) => {
    if (matchesWithResultItem.goalsHomeTeam == null || matchesWithResultItem.goalsAwayTeam == null) {
      throw new Error('match not have result')
    }

    const isCorrect = isBetWin({
      betLabelId: args.betLabelId,
      bet: args.bet,
      goals: {
        home: matchesWithResultItem.goalsHomeTeam,
        away: matchesWithResultItem.goalsAwayTeam,
      },
    })

    return isCorrect
  })

  const totalWithResult = matchesWithResult.length
  const totalCorrect = correctMatches.length
  const calculateCorrectPercent = () => {
    if (!totalWithResult) {
      return 0
    }

    return Math.round((totalCorrect / totalWithResult) * 100)
  }

  const calculateAverageOdd = () => {
    if (args.odds.length === 0) {
      return null
    }
    const sum = sumBy(args.odds, 'oddSize')

    return round(sum / args.odds.length, 2)
  }

  const totalNotCorrect = totalWithResult - totalCorrect

  const calculateProfit = () => {
    let profit = 0

    correctMatches.forEach((correctMatchesItem) => {
      const correctMatchOdd = args.odds.find((oddsItem) => {
        return oddsItem.matchId === correctMatchesItem._id?.toString()
      })

      if (!correctMatchOdd) {
        throw new Error('Odd not found')
      }

      profit += correctMatchOdd.oddSize - 1
    })

    return round(profit - totalNotCorrect, 2)
  }

  const profit = calculateProfit()

  const calculateProfitPerPick = () => {
    if (totalWithResult === 0) {
      return 0
    }

    return round(profit / totalWithResult, 2)
  }

  const profitPerPick = calculateProfitPerPick()

  return {
    total: args.matches.length,
    totalWithResult: matchesWithResult.length,
    totalCorrect: correctMatches.length,
    totalNotCorrect,
    correctPercent: calculateCorrectPercent(),
    averageOdd: calculateAverageOdd(),
    profit,
    profitPerPick,
    roi: round(profitPerPick * 100, 2),
  }
}
