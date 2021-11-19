import { chunk } from 'lodash'
import axios from 'axios'
import { BetLabelEnum, BetLabelMatchWinnerValue, BetLabelGoalsOverUnderValue } from './BetLabels'
import { printlog } from './printlog'

interface IPredictByChunksArgs {
  host?: string
  matchesIds: string[]
  chunkSize: number
}

interface IPredictions {
  [BetLabelEnum.MatchWinner]: {
    [BetLabelMatchWinnerValue.Home]: number
    [BetLabelMatchWinnerValue.Draw]: number
    [BetLabelMatchWinnerValue.Away]: number
  }
  [BetLabelEnum.GoalsOverUnder]: {
    [BetLabelGoalsOverUnderValue.Under0_5]: number
    [BetLabelGoalsOverUnderValue.Over0_5]: number
    [BetLabelGoalsOverUnderValue.Under1_5]: number
    [BetLabelGoalsOverUnderValue.Over1_5]: number
    [BetLabelGoalsOverUnderValue.Under2_5]: number
    [BetLabelGoalsOverUnderValue.Over2_5]: number
    [BetLabelGoalsOverUnderValue.Under3_5]: number
    [BetLabelGoalsOverUnderValue.Over3_5]: number
    [BetLabelGoalsOverUnderValue.Under4_5]: number
    [BetLabelGoalsOverUnderValue.Over4_5]: number
    [BetLabelGoalsOverUnderValue.Under5_5]: number
    [BetLabelGoalsOverUnderValue.Over5_5]: number
    [BetLabelGoalsOverUnderValue.Under6_5]: number
    [BetLabelGoalsOverUnderValue.Over6_5]: number
  }
}

export interface IPredictionBotMatchPredictions {
  matchId: string
  predictions: IPredictions | null
}

interface IModelParmas {
  matchesToPredict_ids: string[]
  params?: object
}

const predict = async (matchesIds: string[], host?: string): Promise<IPredictionBotMatchPredictions[]> => {
  const body: IModelParmas = {
    matchesToPredict_ids: matchesIds,
  }

  const getUrl = () => {
    if (host) {
      return `${host}/predict`
    }

    return 'http://localhost:5000/predict'
  }

  const res = await axios.post(getUrl(), body, { timeout: matchesIds.length * 1 * 1000 })

  return res.data
}

export async function predictByChunks(args: IPredictByChunksArgs, onProgres?: (percent: number) => void) {
  const matchesChunks = chunk(args.matchesIds, args.chunkSize)

  let predictions: IPredictionBotMatchPredictions[] = []

  for (let i = 0; i < matchesChunks.length; i++) {
    if (onProgres) {
      onProgres(i > 0 ? (i / matchesChunks.length) * 100 : 0)
    }
    try {
      const predictionsChunk = await predict(matchesChunks[i], args.host)
      predictions = predictions.concat(predictionsChunk)
    } catch (err) {
      printlog('CHUNK ' + i + ' ERR', err)
    }
  }

  return predictions
}
