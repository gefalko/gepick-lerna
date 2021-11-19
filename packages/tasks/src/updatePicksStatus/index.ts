import { findPendingPicks } from '@gepick/database'
import { setPickStatus, setPickProfit } from '@gepick/utils'

export async function updatePicksStatus() {
  const pendingPicks = await findPendingPicks()

  for (const pick of pendingPicks) {
    if (pick.match) {
      pick.status = setPickStatus(pick.match, pick.betLabelId, pick.bet)
      pick.profit = setPickProfit(pick.oddSize, pick.status)
      await pick.save()
    }
  }
}
