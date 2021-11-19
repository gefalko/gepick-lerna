import { findMatchPredictionsByTimeInterval } from '@gepick/database'
import predictionsToPick from './utils/predictionsToPick'
import filterPicksByProbabilities from './utils/filterPicksByProbabilities'
import assignOddsToPicks from './utils/assignOddsToPicks'
import filterPicksByOddsAndValue from './utils/filterPicksByOddsAndValue'
import assignMatchesToPicks from './utils/assignMatchesToPicks'

interface ISettings {
  botDockerImage: string
  betLabelId: number
  bet: string
  oddIndex: number
  valueFrom: number
  valueTo: number
  probabilityFrom: number
  probabilityTo: number
  oddProbabilityFrom: number
  oddProbabilityTo: number
}

interface IFindDayPicksBySettingsArgs {
  day: string
  settings: ISettings
}

export async function findDayPicksBySettings(args: IFindDayPicksBySettingsArgs) {
  const dayPredictions = await findMatchPredictionsByTimeInterval({
    fromDay: args.day,
    toDay: args.day,
    botDockerImage: args.settings.botDockerImage,
    betLabelId: args.settings.betLabelId,
  })

  const dayPicks = predictionsToPick({
    predictions: dayPredictions,
    betLabelId: args.settings.betLabelId,
    bet: args.settings.bet,
  })

  const dayPicks2 = filterPicksByProbabilities({
    picks: dayPicks,
    probabilityFrom: args.settings.probabilityFrom,
    probabilityTo: args.settings.probabilityTo,
  })

  const dayPicks3 = await assignOddsToPicks({
    picks: dayPicks2,
    betLabelId: args.settings.betLabelId,
    bet: args.settings.bet,
    oddIndex: args.settings.oddIndex,
  })

  const dayPicks4 = filterPicksByOddsAndValue({
    picks: dayPicks3,
    oddProbabilityFrom: args.settings.oddProbabilityFrom,
    oddProbabilityTo: args.settings.oddProbabilityTo,
    valueFrom: args.settings.valueFrom,
    valueTo: args.settings.valueTo,
  })

  const dayPicks5 = await assignMatchesToPicks({
    picks: dayPicks4,
    matchPopulateOptions: { country: true },
  })

  return dayPicks5
}
