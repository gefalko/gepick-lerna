import { findMatchesByDay } from '@gepick/database'
import { findMatchOdds, createMatchOdds } from '@gepick/database/src/models/matchOdds/functions'
import { IOddsByFixtureIdResponse_Odd_Bookmaker_Bet } from '@gepick/api-football/types'
import { getOddsByFixtureId } from '@gepick/api-football'
import { printlog } from '@gepick/utils'
import {availableBookmakers} from '@gepick/utils/src/bookmakers'

interface ICreateMatchOddsIfNotExistProps {
  apiFootballBookamkerId: number
  updateAt: number
  matchId: string
  matchStartDay: string
  oddsByBetLabel: IOddsByFixtureIdResponse_Odd_Bookmaker_Bet
}

async function createMatchOddsIfNotExist(props: ICreateMatchOddsIfNotExistProps) {
  const betLabelId = parseInt(props.oddsByBetLabel.label_id, 10)

  const matchOdds = await findMatchOdds({
    betLabelId,
    updateAt: props.updateAt,
    apiFootballBookamkerId: props.apiFootballBookamkerId,
    matchId: props.matchId,
  })

  if (!matchOdds.length) {
    const oddsByBet = props.oddsByBetLabel.values.map((oddByBet) => {
      return {
        bet: oddByBet.value,
        oddSize: oddByBet.odd,
      }
    })

    await createMatchOdds({
      betLabelId,
      updateAt: props.updateAt,
      matchStartDay: props.matchStartDay,
      apiFootballBookamkerId: props.apiFootballBookamkerId,
      matchId: props.matchId,
      oddsByBet,
    })
  }
}

interface ICollectAndSaveOddsProps {
  apiFootballFixtureId: number
  matchId: string
  matchStartDay: string
}

async function collectAndSaveOdds(props: ICollectAndSaveOddsProps) {
  const apiFootballOdds = await getOddsByFixtureId(props.apiFootballFixtureId)

  for (const oddsItem of apiFootballOdds) {
    for (const oddsByBookmaker of oddsItem.bookmakers) {
      if (availableBookmakers.includes(oddsByBookmaker.bookmaker_id)) {
        for (const oddsByBetLabel of oddsByBookmaker.bets) {
          const betLabelId = parseInt(oddsByBetLabel.label_id, 10)
          if (betLabelId === 1 || betLabelId === 5) {
            await createMatchOddsIfNotExist({
              apiFootballBookamkerId: oddsByBookmaker.bookmaker_id,
              matchId: props.matchId,
              matchStartDay: props.matchStartDay,
              updateAt: oddsItem.fixture.updateAt,
              oddsByBetLabel,
            })
          }
        }
      }
    }
  }
}

async function collectDayMatchesOdds(day: string) {
  const dbMatches = await findMatchesByDay({ day, populateOptions: {} })
  let i = 0

  for (const match of dbMatches) {
    i++

    printlog(`---------------------------match of ${i}/${dbMatches.length}----------------------------`)

    await collectAndSaveOdds({
      matchId: match._id,
      matchStartDay: day,
      apiFootballFixtureId: match.apiFootballFixtureId,
    })
  }
}

export default collectDayMatchesOdds
