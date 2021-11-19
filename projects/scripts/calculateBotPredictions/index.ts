import { connectToDb } from '@gepick/database'
import {
  calculateDayMatchesPredictions,
  calculateMatchPredictionsByPredictionBot,
} from '@gepick/predictions-calculator'
import { cmd, printlog } from '@gepick/utils'

async function start() {
  await connectToDb()

  try {
    if (cmd.apiFootballFixtureId && cmd.predictionBotDockerImage) {
      await calculateMatchPredictionsByPredictionBot({
        apiFootballFixtureId: cmd.apiFootballFixtureId,
        predictionBotDockerImage: cmd.predictionBotDockerImage,
      })
    }

    if (cmd.day) {
      await calculateDayMatchesPredictions({ day: cmd.day })
    }
  } catch (err) {
    printlog(err)
  }
}

export default start
