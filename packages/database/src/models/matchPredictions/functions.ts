import { printlog } from '@gepick/utils'
import { toGepickOneDayInterval } from '@gepick/utils/src/dates'
import MatchPredictionsModel, { MatchPredictions } from './MatchPredictionsModel'

export async function saveMatchPredictions(matchPredictions: MatchPredictions) {
  try {
    const dbMatchPredictions = await new MatchPredictionsModel(matchPredictions).save()

    return dbMatchPredictions
  } catch (err) {
    printlog('Failed save matchPredictions')
    throw err
  }
}

export async function findMatchPredictionsById(matchPredictionsId: string) {
  const matchPredictions = await MatchPredictionsModel.findOne({
    _id: matchPredictionsId,
  })

  return matchPredictions
}

interface IFindMatchPredictionsProps {
  search: {
    matchId?: string
    botDockerImage?: string
    betLabelId?: number
  }
}

export async function findMatchPredictions(props: IFindMatchPredictionsProps) {
  const matchPredictions = await MatchPredictionsModel.find(props.search)

  return matchPredictions
}

export async function findMatchPredictionsByMatchIds(ids: string[]) {
  const matchesPredictions = await MatchPredictionsModel.find({
    matchId: { $in: ids },
  })

  return matchesPredictions
}

interface IFindMatchPredictionsByTimeIntervalArgs {
  fromDay: string
  toDay: string
  betLabelId: number
  botDockerImage: string
}

export async function findMatchPredictionsByTimeInterval(args: IFindMatchPredictionsByTimeIntervalArgs) {
  const { fromDatetime } = toGepickOneDayInterval(args.fromDay)
  const { toDatetime } = toGepickOneDayInterval(args.fromDay)

  const predictions = await MatchPredictionsModel.find({
    matchStartTime: {
      $gte: fromDatetime.toDate(),
      $lt: toDatetime.toDate(),
    },
    betLabelId: args.betLabelId,
    botDockerImage: args.botDockerImage,
  })

  return predictions
}
