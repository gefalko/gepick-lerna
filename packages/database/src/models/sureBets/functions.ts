import { BetLabelIdEnum } from '@gepick/utils'
import { isEqual } from 'lodash'
import SureBetsModel, { SureBetOddsValue } from './SureBetsModel'
import { findMatchByFixtureId } from '../../functions/match/find'

interface IFindSureBetsByFixtureIdArgs {
  apiFootballFixtureId: number
  betLabelId: BetLabelIdEnum
}

async function findSureBetsByFixtureId(args: IFindSureBetsByFixtureIdArgs) {
  const sureBets = await SureBetsModel.findOne({
    apiFootballFixtureId: args.apiFootballFixtureId,
    betLabelId: args.betLabelId,
  }).exec()

  return sureBets
}

interface ISureBetsHasOddsArgs {
  apiFootballFixtureId: number
  betLabelId: BetLabelIdEnum
  values: SureBetOddsValue[]
}

async function sureBetsHasOdds(args: ISureBetsHasOddsArgs) {
  const existSureBets = await findSureBetsByFixtureId({
    apiFootballFixtureId: args.apiFootballFixtureId,
    betLabelId: args.betLabelId,
  })

  if (existSureBets) {
    const found = existSureBets.sureBetOddsList.find((sureBetOddsListItem) => {
      return isEqual(JSON.stringify(sureBetOddsListItem.values), JSON.stringify(args.values))
    })

    return found != null
  }

  return false
}

interface IInsertSureBetsArgs {
  apiFootballFixtureId: number
  betLabelId: BetLabelIdEnum
  values: SureBetOddsValue[]
  profit: number
}

interface IPushSureBetsOddsArgs {
  sureBetsId: string
  profit: number
  values: SureBetOddsValue[]
}

export async function pushSureBetsOdds(args: IPushSureBetsOddsArgs) {
  const updated = await SureBetsModel.updateOne(
    { _id: args.sureBetsId },
    {
      $push: {
        sureBetOddsList: {
          createdAt: new Date(),
          profit: args.profit,
          values: args.values,
        },
      },
    },
  ).exec()

  return updated
}

interface IInsertSureBetsArgs {
  apiFootballFixtureId: number
  betLabelId: BetLabelIdEnum
  values: SureBetOddsValue[]
  profit: number
  day: string
}

export async function insertSureBets(args: IInsertSureBetsArgs) {
  const existSureBets = await findSureBetsByFixtureId({
    apiFootballFixtureId: args.apiFootballFixtureId,
    betLabelId: args.betLabelId,
  })

  if (existSureBets) {
    const hasOdds = await sureBetsHasOdds({
      apiFootballFixtureId: args.apiFootballFixtureId,
      betLabelId: args.betLabelId,
      values: args.values,
    })

    if (hasOdds) {
      return existSureBets
    }

    const updatedSureBets = await pushSureBetsOdds({
      sureBetsId: existSureBets._id,
      profit: args.profit,
      values: args.values,
    })

    return updatedSureBets
  }

  const match = await findMatchByFixtureId(args.apiFootballFixtureId)

  if (!match) {
    throw new Error('Match not found by fixtureId ' + args.apiFootballFixtureId)
  }

  const newSureBets = await SureBetsModel.create({
    apiFootballFixtureId: args.apiFootballFixtureId,
    match,
    matchId: match._id,
    betLabelId: args.betLabelId,
    day: args.day,
    sureBetOddsList: [
      {
        createdAt: new Date(),
        profit: args.profit,
        values: args.values,
      },
    ],
  })

  return newSureBets
}

export async function findSureBetsByDay(day: string) {
  const sureBets = await SureBetsModel.find({
    day,
  })
    .populate({ path: 'match', populate: 'country' })
    .exec()

  return sureBets
}
