import {
  findAllPredictionBots,
  findMatchByFixtureId,
  findMatchesByDay,
  PredictionBot,
  Match,
  saveMatchPredictions,
  findPredictionBotByDockerImage,
  findMatchPredictions,
} from '@gepick/database'
import { printlog, predictByChunks } from '@gepick/utils'
import { BetLabels } from '@gepick/utils/src/BetLabels'
import { formatMatchWinnerBetPredictions } from './utils'

async function calculatePredictionBotPredictions(predictionBot: PredictionBot, matches: Match[]) {
  if (!predictionBot.active) {
    printlog('bot is not active', predictionBot.dockerImage)
    return
  }

  const matchesIds = matches.map((match) => match._id)
  const allMatchesPredictions = await predictByChunks(
    {
      host: 'http://localhost:' + predictionBot.portNumber,
      matchesIds: matchesIds as string[],
      chunkSize: 10,
    },
    printlog,
  )

  for (const matchNewPredictions of allMatchesPredictions) {
    if (matchNewPredictions.predictions) {
      const match = matches.find((matchItem) => matchItem._id?.toString() === matchNewPredictions.matchId.toString())

      const matchBotDbPrediction = await findMatchPredictions({
        search: {
          matchId: matchNewPredictions.matchId,
          botDockerImage: predictionBot.dockerImage,
          betLabelId: BetLabels.MatchWinner.apiFootballLabelId,
        },
      })

      if (match) {
        if (!matchBotDbPrediction.length) {
          const formatedMatchWinnerPredictions = {
            matchId: matchNewPredictions.matchId,
            botDockerImage: predictionBot.dockerImage,
            createTime: new Date(),
            matchStartTime: match.startTime,
            betLabelId: BetLabels.MatchWinner.apiFootballLabelId,
            predictionsByBet: formatMatchWinnerBetPredictions(matchNewPredictions),
          }

          await saveMatchPredictions(formatedMatchWinnerPredictions)
        } else {
          printlog('Match has predictions')
        }
      } else {
        throw new Error('Match not found')
      }
    } else {
      printlog('Predictor predictions is null!')
    }
  }
}

async function calculateMatchesPredictionsByPredictionBots(predictionBots: PredictionBot[], matches: Match[]) {
  for (let i = 0; i < predictionBots.length; i++) {
    const bot = predictionBots[i]
    try {
      await calculatePredictionBotPredictions(bot, matches)
    } catch (err) {
      printlog('ERROR', bot)
      printlog('ERROR MSG', err.message)
    }
  }
}

interface ICalculateMatchPredictionsByPredictionBotTagProps {
  apiFootballFixtureId: number
  predictionBotDockerImage: string
}

export async function calculateMatchPredictionsByPredictionBot(
  props: ICalculateMatchPredictionsByPredictionBotTagProps,
) {
  const predictionBot = await findPredictionBotByDockerImage(props.predictionBotDockerImage)

  if (predictionBot) {
    const match = await findMatchByFixtureId(props.apiFootballFixtureId)

    if (match) {
      await calculatePredictionBotPredictions(predictionBot, [match])
    }
  }
}

interface ICalculateDayPredictionsProps {
  day: string
}

export async function calculateDayMatchesPredictions(props: ICalculateDayPredictionsProps) {
  const predictionBots = await findAllPredictionBots()
  const dayMatches = await findMatchesByDay({ day: props.day })
  await calculateMatchesPredictionsByPredictionBots(predictionBots, dayMatches)
}
