import { pickBy, identity } from 'lodash'
import { mapId, isDefined } from '@gepick/utils'
import MatchOddsModel, { OddBybet } from './MatchOddsModel'
import { Match } from '../match/MatchModel'

interface IFindMatchOddsProps {
  apiFootballBookamkerId?: number
  betLabelId?: number
  updateAt?: number
  matchId?: string
  matchStartDay?: string
}

export async function findMatchOdds(props: IFindMatchOddsProps) {
  const search = pickBy(
    {
      betLabelId: props.betLabelId,
      updateAt: props.updateAt,
      apiFootballBookamkerId: props.apiFootballBookamkerId,
      matchId: props.matchId,
      matchStartDay: props.matchStartDay,
    },
    identity,
  )

  const matchOdds = await MatchOddsModel.find(search)

  return matchOdds
}

interface ICreateMatchOddsProps {
  apiFootballBookamkerId: number
  betLabelId: number
  updateAt: number
  matchId: string
  matchStartDay: string
  oddsByBet: OddBybet[]
}

export async function createMatchOdds(props: ICreateMatchOddsProps) {
  const matchOdds = await new MatchOddsModel({
    apiFootballBookamkerId: props.apiFootballBookamkerId,
    betLabelId: props.betLabelId,
    updateAt: props.updateAt,
    matchId: props.matchId,
    matchStartDay: props.matchStartDay,
    oddsByBet: props.oddsByBet,
  }).save()

  return matchOdds
}

interface IFindMatchOddsByMatchIdsProps {
  ids: string[]
  bookmakersApiIds?: number[]
  betLabelIds?: number[]
}

export async function findMatchOddsByMatchIds(props: IFindMatchOddsByMatchIdsProps) {
  const matchesOdds = await MatchOddsModel.find({
    $and: [
      { matchId: { $in: props.ids } },
      props.bookmakersApiIds ? { apiFootballBookamkerId: { $in: props.bookmakersApiIds } } : {},
      props.betLabelIds ? { betLabelId: { $in: props.betLabelIds } } : {},
    ],
  })

  return matchesOdds
}

export async function joinOdds(matches: Match[]) {
  const matchIds = matches.map(mapId).filter(isDefined) as string[]
  const matchesOdds = await findMatchOddsByMatchIds({ ids: matchIds })

  const matchesWithOdds = matches.map((match) => {
    const matchOdds = matchesOdds.find((odd) => {
      return odd.matchId === match._id
    })

    return {
      ...match,
      odds: matchOdds,
    }
  })

  return matchesWithOdds
}
