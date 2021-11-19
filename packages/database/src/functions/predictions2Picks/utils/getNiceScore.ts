interface IArgs {
  goalsHomeTeam?: number
  goalsAwayTeam?: number
}

function getNiceScore(args: IArgs) {
  if (args.goalsHomeTeam != null && args.goalsAwayTeam != null) {
    return args.goalsHomeTeam + ':' + args.goalsAwayTeam
  }

  return undefined
}

export default getNiceScore
