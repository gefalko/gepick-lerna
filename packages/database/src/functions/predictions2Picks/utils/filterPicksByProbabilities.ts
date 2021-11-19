interface IFilterPicksByProbabilitiesPick {
  matchId: string
  probability: number
}

interface IFilterPicksByProbabilitiesArgs {
  picks: (IFilterPicksByProbabilitiesPick | undefined)[]
  probabilityFrom: number
  probabilityTo: number
}

function filterPicksByProbabilities(args: IFilterPicksByProbabilitiesArgs) {
  const filteredPicks = args.picks.filter((picksItem) => {
    if (!picksItem) {
      return false
    }

    if (picksItem.probability < args.probabilityFrom) {
      return false
    }

    if (picksItem.probability > args.probabilityTo) {
      return false
    }

    return true
  })

  return filteredPicks
}

export default filterPicksByProbabilities
