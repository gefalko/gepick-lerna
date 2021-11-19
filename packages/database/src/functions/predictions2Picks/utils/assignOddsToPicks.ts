import { isDefined, oddToProbability } from '@gepick/utils'
import { sortBy } from 'lodash'
import { findMatchOddsByMatchIds } from '@gepick/database/src/models/matchOdds/functions'
import { getBookmakerName } from '@gepick/utils/src/bookmakers'

interface IAssignOddsToPicksPick {
  matchId: string
  probability: number
}

interface IAssignOddsToPicksArgs {
  picks: (IAssignOddsToPicksPick | undefined)[]
  betLabelId: number
  bet: string
  oddIndex: number
}

interface IResponsePick {
  matchId: string
  probability: number
  odd: number
  oddProbability: number
  value: number
  betLabelId: number
  bet: string
  bookmakerId: number
  bookmakerName: string
}

async function assignOddsToPicks(args: IAssignOddsToPicksArgs): Promise<(IResponsePick | undefined)[]> {
  const matchIds = args.picks
    .map((picksItem) => {
      return picksItem?.matchId
    })
    .filter(isDefined)

  const odds = await findMatchOddsByMatchIds({
    ids: matchIds as string[],
    betLabelIds: [args.betLabelId],
  })

  const picksWithOdds = args.picks.map((picksItem) => {
    if (!picksItem) {
      return undefined
    }

    const pickOdds = odds.filter((oddsItem) => {
      return oddsItem.matchId === picksItem.matchId
    })

    const sortedOdds = sortBy(pickOdds, (pickOddsItem) => {
      const pickOddByBet = pickOddsItem.oddsByBet.find((oddsByBetItem) => {
        return oddsByBetItem.bet === args.bet
      })

      return pickOddByBet?.oddSize ?? 0
    }).reverse()

    const pickOdd = sortedOdds[args.oddIndex]

    if (!pickOdd) {
      return undefined
    }

    const pickOddByBet = pickOdd.oddsByBet.find((oddsByBetItem) => {
      return oddsByBetItem.bet === args.bet
    })

    if (!pickOddByBet) {
      return undefined
    }

    const oddProbability = oddToProbability(pickOddByBet.oddSize)

    return {
      matchId: picksItem.matchId,
      probability: picksItem.probability,
      odd: pickOddByBet.oddSize,
      bookmakerName: getBookmakerName(pickOdd.apiFootballBookamkerId),
      oddProbability,
      value: picksItem.probability - oddProbability,
      betLabelId: args.betLabelId,
      bet: args.bet,
      bookmakerId: pickOdd.apiFootballBookamkerId,
    } as IResponsePick
  })

  return picksWithOdds
}

export default assignOddsToPicks
