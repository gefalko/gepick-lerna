import { cmd, getBetLabelByLabelId } from '@gepick/utils'
import { findDayPicksBySettings } from '@gepick/database/src/functions/predictions2Picks/predictions2Picks'
import { saveProfitablePicks } from '@gepick/database/src/models/profitablePick/functions'
import { IAssignMatchesToPicksResponse } from '@gepick/database/src/functions/predictions2Picks/utils/assignMatchesToPicks'
import { ProfitablePick } from '@gepick/database/src/models/profitablePick/ProfitablePickModel'
import getNiceScore from '@gepick/database/src/functions/predictions2Picks/utils/getNiceScore'
import { connectToDb } from '@gepick/database'

const settingsList = [
  {
    botDockerImage: 'gepickcom/poiison:version1',
    betLabelId: 1,
    bet: 'Home',
    oddIndex: 0,
    valueFrom: -100,
    valueTo: 100,
    probabilityFrom: 90,
    probabilityTo: 100,
    oddProbabilityFrom: 0,
    oddProbabilityTo: 35,
  },
]

function toProfitablePick(pick: IAssignMatchesToPicksResponse): ProfitablePick {
  const score = getNiceScore({
    goalsHomeTeam: pick.match.goalsHomeTeam,
    goalsAwayTeam: pick.match.goalsAwayTeam,
  })

  const getBetNiceName = () => {
    const betLabel = getBetLabelByLabelId(pick.betLabelId)

    return betLabel?.name + ' - ' + pick.bet
  }

  return {
    match: pick.match,
    matchStartTime: pick.match.startTime,
    leagueName: pick.match.leagueName,
    countryName: pick.match.countryName,
    countryFlag: pick.match.country.flag,
    score,
    probability: pick.probability,
    oddProbability: pick.oddProbability,
    value: pick.value,
    odd: pick.odd,
    profit: pick.profit,
    bookmakerName: pick.bookmakerName,
    status: pick.status,
    matchNiceStatus: pick.match.niceStatus,
    homeTeamName: pick.match.homeTeamName,
    awayTeamName: pick.match.awayTeamName,
    key: pick.matchId + '_' + pick.betLabelId + '_' + pick.bet,
    isPickWin: pick.isPickWin,
    bet: pick.bet,
    betLabelId: pick.betLabelId,
    betNiceName: getBetNiceName(),
  }
}

async function collectDayProfitablePicks(day: string) {
  const [settings] = settingsList

  const picks = await findDayPicksBySettings({
    day,
    settings,
  })

  const profitablePicks = picks.map(toProfitablePick)

  await saveProfitablePicks({ picks: profitablePicks })
}

async function collectProfitablePicks() {
  if (!cmd.day) {
    throw new Error('-d is required')
  }
  await connectToDb()
  await collectDayProfitablePicks(cmd.day)
}

export default collectProfitablePicks
