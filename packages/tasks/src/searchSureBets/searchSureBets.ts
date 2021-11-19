import { getDayBetOddsByDay } from '@gepick/api-football'
import {
  IDayOddsResponseResponse,
  IDayOddsResponseResponseBookmaker,
  IDayOddsResponseResponseBookmakerBetValue,
} from '@gepick/api-football/types'
import { BetLabelIdEnum, isDefined, printlog } from '@gepick/utils'
import { insertSureBets } from '@gepick/database/src/models/sureBets/functions'

interface IFilterByBetsArgs {
  betLabelId: BetLabelIdEnum
  bookmakers: IDayOddsResponseResponseBookmaker[]
}

function filterByBets(args: IFilterByBetsArgs) {
  const betsByBetLabel = args.bookmakers.map((bookmakersItem) => {
    const bets = bookmakersItem.bets.find((betsItem) => {
      return betsItem.id === args.betLabelId
    })
    if (bets) {
      return {
        id: bets.id,
        name: bets.name,
        values: bets.values,
        bookmakerId: bookmakersItem.id,
        bookerName: bookmakersItem.name,
      }
    }

    return undefined
  })

  return betsByBetLabel.filter((betsByBetLabelItem) => betsByBetLabelItem != null)
}

interface IBetsItem {
  id: number
  name: string
  bookmakerId: number
  bookerName: string
  values: IDayOddsResponseResponseBookmakerBetValue[]
}

interface IFindOddArgs {
  betsItem: IBetsItem
  bet: string
}

function findOdd(args: IFindOddArgs) {
  const odd = args.betsItem.values.find((valueItem) => {
    return valueItem.value === args.bet
  })

  if (!odd) {
    throw new Error(`${args.bet} odd not found`)
  }

  return {
    bookmakerId: args.betsItem.bookmakerId,
    odd: parseFloat(odd.odd),
    value: odd.value,
  }
}

function searchMatchWinnerSureBets(bookmakers: IDayOddsResponseResponseBookmaker[]) {
  const bets = filterByBets({
    betLabelId: BetLabelIdEnum.MatchWinner,
    bookmakers,
  })

  let bestHome = {
    odd: 0,
    value: 'Home',
    bookmakerId: 1,
  }
  let bestDraw = {
    odd: 0,
    value: 'Draw',
    bookmakerId: 1,
  }
  let bestAway = {
    odd: 0,
    value: 'Away',
    bookmakerId: 1,
  }

  for (const betsItem of bets) {
    try {
      if (!betsItem) {
        throw new Error('betsItem is not defined')
      }

      const homeOdd = findOdd({ betsItem, bet: 'Home' })
      const drawOdd = findOdd({ betsItem, bet: 'Draw' })
      const awayOdd = findOdd({ betsItem, bet: 'Away' })

      if (bestHome.odd < homeOdd.odd) {
        bestHome = homeOdd
      }
      if (bestDraw.odd < drawOdd.odd) {
        bestDraw = drawOdd
      }
      if (bestAway.odd < awayOdd.odd) {
        bestAway = awayOdd
      }
    } catch (err) {
      printlog(err)
    }
  }

  const profit = 1 - (1 / bestHome.odd + 1 / bestDraw.odd + 1 / bestAway.odd)
  const isSureBet = profit > 0

  if (isSureBet) {
    return {
      values: [bestHome, bestDraw, bestAway],
      profit,
    }
  }

  return undefined
}

interface ISearchUnderOverSureBetsArgs {
  bookmakers: IDayOddsResponseResponseBookmaker[]
  size: '0.5' | '1.5' | '2.5' | '3.5' | '4.5' | '5.5' | '6.5'
}

function searchUnderOverSureBets(args: ISearchUnderOverSureBetsArgs) {
  const bets = filterByBets({
    betLabelId: BetLabelIdEnum.GoalsOverUnder,
    bookmakers: args.bookmakers,
  })

  const underValue = `Under ${args.size}`
  const overValue = `Over ${args.size}`

  let bestUnder = {
    odd: 0,
    value: underValue,
    bookmakerId: 1,
  }
  let bestOver = {
    odd: 0,
    value: overValue,
    bookmakerId: 1,
  }

  for (const betsItem of bets) {
    try {
      if (!betsItem) {
        throw new Error('betsItem is not defined')
      }

      const underOdd = findOdd({ betsItem, bet: underValue })
      const overOdd = findOdd({ betsItem, bet: overValue })

      if (bestUnder.odd < underOdd.odd) {
        bestUnder = underOdd
      }
      if (bestOver.odd < overOdd.odd) {
        bestOver = overOdd
      }
    } catch (err) {
      printlog('Odd not found of U/O ' + args.size)
    }
  }

  const profit = 1 - (1 / bestUnder.odd + 1 / bestOver.odd)
  const isSureBet = profit > 0

  if (isSureBet) {
    return {
      values: [bestUnder, bestOver],
      profit,
    }
  }

  return undefined
}

function searchMatchSureBets(matchOdds: IDayOddsResponseResponse) {
  const matchWinnerSureBets = searchMatchWinnerSureBets(matchOdds.bookmakers)
  const underOver0_5SureBets = searchUnderOverSureBets({ bookmakers: matchOdds.bookmakers, size: '0.5' })
  const underOver1_5SureBets = searchUnderOverSureBets({ bookmakers: matchOdds.bookmakers, size: '1.5' })
  const underOver2_5SureBets = searchUnderOverSureBets({ bookmakers: matchOdds.bookmakers, size: '2.5' })
  const underOver3_5SureBets = searchUnderOverSureBets({ bookmakers: matchOdds.bookmakers, size: '3.5' })
  const underOver4_5SureBets = searchUnderOverSureBets({ bookmakers: matchOdds.bookmakers, size: '4.5' })
  const underOver5_5SureBets = searchUnderOverSureBets({ bookmakers: matchOdds.bookmakers, size: '5.5' })
  const underOver6_5SureBets = searchUnderOverSureBets({ bookmakers: matchOdds.bookmakers, size: '6.5' })

  const sureBetsList = [
    matchWinnerSureBets,
    underOver0_5SureBets,
    underOver1_5SureBets,
    underOver2_5SureBets,
    underOver3_5SureBets,
    underOver4_5SureBets,
    underOver5_5SureBets,
    underOver6_5SureBets,
  ].filter(isDefined)

  const formatedSureBetsList = sureBetsList.map((sureBetsListItem) => {
    if (sureBetsListItem) {
      return {
        apiFootballFixtureId: matchOdds.fixture.id,
        betLabelId: BetLabelIdEnum.MatchWinner,
        profit: sureBetsListItem.profit,
        sureBetOddsList: sureBetsListItem.values,
      }
    }

    return undefined
  })

  return formatedSureBetsList
}

async function searchSureBets(day: string) {
  const apiOdds = await getDayBetOddsByDay({
    day,
  })

  const sureBetsList = apiOdds.map(searchMatchSureBets).filter(isDefined)

  const minProfit = 0.02

  for (let matchSureBetsList of sureBetsList) {
    for (let sureBet of matchSureBetsList) {
      if (sureBet && sureBet.profit > minProfit) {
        try {
          await insertSureBets({
            day,
            profit: sureBet.profit,
            values: sureBet.sureBetOddsList,
            betLabelId: sureBet.betLabelId,
            apiFootballFixtureId: sureBet.apiFootballFixtureId,
          })
        } catch (err) {
          printlog(err)
        }
      }
    }
  }

  return null
}

export default searchSureBets
