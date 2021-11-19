import { BetLabelMatchWinnerValue, BetLabelGoalsOverUnderValue } from '@gepick/utils/src/BetLabels'
import { IPredictionBotMatchPredictions } from '@gepick/utils/src/predict'

export function formatMatchWinnerBetPredictions(matchPredictions: IPredictionBotMatchPredictions) {
  if (!matchPredictions.predictions) {
    return []
  }

  const predictionsByBet = [
    {
      bet: BetLabelMatchWinnerValue.Home,
      probability: matchPredictions.predictions.MatchWinner.Home,
    },
    {
      bet: BetLabelMatchWinnerValue.Draw,
      probability: matchPredictions.predictions.MatchWinner.Draw,
    },
    {
      bet: BetLabelMatchWinnerValue.Away,
      probability: matchPredictions.predictions.MatchWinner.Away,
    },
  ]

  const filteredPredictionsByBet = predictionsByBet.filter((prediction) => !!prediction.probability)

  return filteredPredictionsByBet
}

export function formatGoalsUnderOverPredictions(matchPredictions: IPredictionBotMatchPredictions) {
  if (!matchPredictions.predictions) {
    return []
  }

  const predictionsByBet = [
    {
      bet: BetLabelGoalsOverUnderValue.Under0_5,
      probability: matchPredictions.predictions.GoalsOverUnder['Under 0.5'],
    },
    {
      bet: BetLabelGoalsOverUnderValue.Over0_5,
      probability: matchPredictions.predictions.GoalsOverUnder['Over 0.5'],
    },
    {
      bet: BetLabelGoalsOverUnderValue.Under0_5,
      probability: matchPredictions.predictions.GoalsOverUnder['Under 0.5'],
    },
    {
      bet: BetLabelGoalsOverUnderValue.Over0_5,
      probability: matchPredictions.predictions.GoalsOverUnder['Over 0.5'],
    },
    {
      bet: BetLabelGoalsOverUnderValue.Under1_5,
      probability: matchPredictions.predictions.GoalsOverUnder['Under 1.5'],
    },
    {
      bet: BetLabelGoalsOverUnderValue.Over1_5,
      probability: matchPredictions.predictions.GoalsOverUnder['Over 1.5'],
    },
    {
      bet: BetLabelGoalsOverUnderValue.Under2_5,
      probability: matchPredictions.predictions.GoalsOverUnder['Under 2.5'],
    },
    {
      bet: BetLabelGoalsOverUnderValue.Over2_5,
      probability: matchPredictions.predictions.GoalsOverUnder['Over 2.5'],
    },
    {
      bet: BetLabelGoalsOverUnderValue.Under3_5,
      probability: matchPredictions.predictions.GoalsOverUnder['Under 3.5'],
    },
    {
      bet: BetLabelGoalsOverUnderValue.Over3_5,
      probability: matchPredictions.predictions.GoalsOverUnder['Over 3.5'],
    },
    {
      bet: BetLabelGoalsOverUnderValue.Under4_5,
      probability: matchPredictions.predictions.GoalsOverUnder['Under 4.5'],
    },
    {
      bet: BetLabelGoalsOverUnderValue.Over4_5,
      probability: matchPredictions.predictions.GoalsOverUnder['Over 4.5'],
    },
    {
      bet: BetLabelGoalsOverUnderValue.Under5_5,
      probability: matchPredictions.predictions.GoalsOverUnder['Under 5.5'],
    },
    {
      bet: BetLabelGoalsOverUnderValue.Over5_5,
      probability: matchPredictions.predictions.GoalsOverUnder['Over 5.5'],
    },
    {
      bet: BetLabelGoalsOverUnderValue.Under6_5,
      probability: matchPredictions.predictions.GoalsOverUnder['Under 6.5'],
    },
    {
      bet: BetLabelGoalsOverUnderValue.Over6_5,
      probability: matchPredictions.predictions.GoalsOverUnder['Over 6.5'],
    },
  ]

  const filteredPredictionsByBet = predictionsByBet.filter((prediction) => !!prediction.probability)

  return filteredPredictionsByBet
}
