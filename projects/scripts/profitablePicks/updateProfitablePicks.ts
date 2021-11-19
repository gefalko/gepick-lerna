import { connectToDb } from '@gepick/database'
import { PickStatusEnum } from '@gepick/database/src/types'
import { isMatchFinished } from '@gepick/utils'
import { findProfitablePicks, updateProfitablePick } from '@gepick/database/src/models/profitablePick/functions'
import getPickStatus from '@gepick/database/src/functions/predictions2Picks/utils/getPickStatus'
import getNiceScore from '@gepick/database/src/functions/predictions2Picks/utils/getNiceScore'
import isPickWin from '@gepick/database/src/functions/predictions2Picks/utils/isPickWin'
import countProfit from '@gepick/database/src/functions/predictions2Picks/utils/countProfit'

async function updateProfitablePicks() {
  await connectToDb()

  const pendingPicks = await findProfitablePicks({
    query: { status: PickStatusEnum.PENDING },
    populate: { match: true },
  })

  for (const pick of pendingPicks) {
    const { match } = pick

    const isPickCorrect = isPickWin({
      isFinished: isMatchFinished(match.status),
      betLabelId: pick.betLabelId,
      bet: pick.bet,
      goalsHomeTeam: match.goalsHomeTeam,
      goalsAwayTeam: match.goalsAwayTeam,
    })

    const newPickStatus = getPickStatus({ matchStatus: match.status, isPickCorrect })

    if (newPickStatus !== PickStatusEnum.PENDING) {
      const score = getNiceScore({
        goalsHomeTeam: match.goalsHomeTeam,
        goalsAwayTeam: match.goalsAwayTeam,
      })

      const profit = countProfit({
        isPickCorrect,
        odd: pick.odd,
      })

      await updateProfitablePick({
        pickId: pick._id,
        status: newPickStatus,
        matchNiceStatus: pick.match.niceStatus,
        score,
        isPickWin: isPickCorrect,
        profit,
      })
    }
  }
}

export default updateProfitablePicks
