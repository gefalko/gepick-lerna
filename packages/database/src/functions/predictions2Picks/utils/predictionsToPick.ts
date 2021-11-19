import { MatchPredictions } from '@gepick/database'
interface IPredictionsToPickArgs {
  predictions: MatchPredictions[]
  bet: string
  betLabelId: number
}

function predictionsToPick(args: IPredictionsToPickArgs) {
  const picks = args.predictions.map((predictionsItem) => {
    const predictionByBet = predictionsItem.predictionsByBet.find((predictionsByBetItem) => {
      return predictionsByBetItem.bet === args.bet
    })

    if (!predictionByBet) {
      return undefined
    }

    return {
      probability: predictionByBet.probability,
      matchId: predictionsItem.matchId,
    }
  })

  return picks
}

export default predictionsToPick
