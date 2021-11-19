import { IPredictionBotMatchPredictions } from '@gepick/utils/src/predict'
import { MatchWinerBetKeysType, GoalsOverUnderBetKeysType } from '@gepick/utils/src/BetLabels'

function getPredictionProbability(
  matchPredictions: IPredictionBotMatchPredictions,
  bet: MatchWinerBetKeysType | GoalsOverUnderBetKeysType,
) {
  const { MatchWinner, GoalsOverUnder } = matchPredictions.predictions ?? {}

  const probability = MatchWinner?.[bet as MatchWinerBetKeysType] ?? GoalsOverUnder?.[bet as GoalsOverUnderBetKeysType]

  if (!probability) {
    return null
  }

  return probability
}

export default getPredictionProbability
