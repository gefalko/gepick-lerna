import { isMatchFinished, isDefined } from '@gepick/utils'
import { findMatchesById, IMatchPopulateOptions } from '@gepick/database'
import { PickStatusEnum } from '@gepick/utils/src/PickStatusEnum'
import { Match } from '@gepick/database/src/models/match/MatchModel'
import getPickStatus from './getPickStatus'
import isPickWin from './isPickWin'
import countProfit from './countProfit'

interface IAssignMatchesToPicksArgsPick {
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

interface IAssignMatchesToPicksArgs {
  picks: (IAssignMatchesToPicksArgsPick | undefined)[]
  matchPopulateOptions?: IMatchPopulateOptions
}

export interface IAssignMatchesToPicksResponse {
  matchId: string
  probability: number
  odd: number
  oddProbability: number
  value: number
  betLabelId: number
  bet: string
  bookmakerId: number
  match: Match
  isFinished: boolean
  bookmakerName: string
  isPickWin?: boolean
  profit?: number
  status: PickStatusEnum
}

async function assignMatchesToPicks(args: IAssignMatchesToPicksArgs): Promise<IAssignMatchesToPicksResponse[]> {
  const matchIds = args.picks
    .map((picksItem) => {
      return picksItem?.matchId
    })
    .filter(isDefined)

  const matches = await findMatchesById(matchIds as string[], args.matchPopulateOptions)

  const picksWithMatches = args.picks.map((picksItem) => {
    const pickMatch = matches.find((matchesItem) => {
      if (!picksItem || !matchesItem._id) {
        return false
      }

      return matchesItem._id.toString() === picksItem.matchId.toString()
    })

    if (!pickMatch || !picksItem) {
      return undefined
    }

    const isFinished = isMatchFinished(pickMatch.status)

    const isPickCorrect = isPickWin({
      isFinished,
      betLabelId: picksItem.betLabelId,
      bet: picksItem.bet,
      goalsHomeTeam: pickMatch.goalsHomeTeam,
      goalsAwayTeam: pickMatch.goalsAwayTeam,
    })

    const profit = countProfit({
      isPickCorrect,
      odd: picksItem.odd,
    })

    const status = getPickStatus({ matchStatus: pickMatch.status, isPickCorrect })

    const pick: IAssignMatchesToPicksResponse = {
      matchId: picksItem.matchId,
      probability: picksItem.probability,
      odd: picksItem.odd,
      oddProbability: picksItem.oddProbability,
      value: picksItem.value,
      betLabelId: picksItem.betLabelId,
      bet: picksItem.bet,
      bookmakerId: picksItem.bookmakerId,
      match: pickMatch,
      isFinished,
      bookmakerName: picksItem.bookmakerName,
      isPickWin: isPickCorrect,
      profit,
      status,
    }

    return pick
  })

  return picksWithMatches.filter(isDefined) as IAssignMatchesToPicksResponse[]
}

export default assignMatchesToPicks
