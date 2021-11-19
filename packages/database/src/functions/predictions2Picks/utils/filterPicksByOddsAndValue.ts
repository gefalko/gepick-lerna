interface IFilterPicksByOddsAndValuePick {
  matchId: string
  probability: number
  odd: number
  oddProbability: number
  value: number
  betLabelId: number
  bet: string
  bookmakerId: number
  bookmakerName: string
}

interface IFilterPicksByOddsAndValueArgs {
  picks: (IFilterPicksByOddsAndValuePick | undefined)[]
  oddProbabilityFrom: number
  oddProbabilityTo: number
  valueFrom: number
  valueTo: number
}

function filterPicksByOddsAndValue(args: IFilterPicksByOddsAndValueArgs) {
  const filteredPicks = args.picks.filter((picksItem) => {
    if (picksItem == null) {
      return false
    }

    if (picksItem.oddProbability < args.oddProbabilityFrom) {
      return false
    }

    if (picksItem.oddProbability > args.oddProbabilityTo) {
      return false
    }

    if (picksItem.value < args.valueFrom) {
      return false
    }

    if (picksItem.value > args.valueTo) {
      return false
    }

    return true
  })

  return filteredPicks
}

export default filterPicksByOddsAndValue
