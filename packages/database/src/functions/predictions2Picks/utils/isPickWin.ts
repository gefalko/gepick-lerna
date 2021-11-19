import { isBetWin } from '@gepick/utils'

interface IArgs {
  isFinished: boolean
  betLabelId: number
  bet: string
  goalsHomeTeam?: number
  goalsAwayTeam?: number
}

function isPickWin(args: IArgs) {
  if (!args.isFinished || args.goalsHomeTeam == null || args.goalsAwayTeam == null) {
    return undefined
  }

  const isWin = isBetWin({
    goals: {
      home: args.goalsHomeTeam,
      away: args.goalsAwayTeam,
    },
    betLabelId: args.betLabelId,
    bet: args.bet,
  })

  return isWin
}

export default isPickWin
