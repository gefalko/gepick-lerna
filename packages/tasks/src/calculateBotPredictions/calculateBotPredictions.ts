import { calculateDayMatchesPredictions } from '@gepick/predictions-calculator'

async function calculateBotPredictions(day: string) {
  await calculateDayMatchesPredictions({ day })
}

export default calculateBotPredictions
