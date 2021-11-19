import ProfitablePickModel, { ProfitablePick } from './ProfitablePickModel'
import { PickStatusEnum } from '../../types'

interface ISaveProfitablePicks {
  picks: ProfitablePick[]
}

export async function saveProfitablePicks(args: ISaveProfitablePicks) {
  const picks = await ProfitablePickModel.insertMany(args.picks, { ordered: false })

  return picks
}

interface IPopulateOptions {
  match?: boolean
}

interface IFindAllProfitablePicksArgs {
  query: {
    status?: PickStatusEnum
  }
  populate?: IPopulateOptions
}

function getPopulationObject(options?: IPopulateOptions) {
  const result = []

  if (options?.match) {
    result.push({
      path: 'match',
    })
  }

  return result
}

export async function findProfitablePicks(args: IFindAllProfitablePicksArgs) {
  const picks = await ProfitablePickModel.find(args.query).populate(getPopulationObject(args.populate))

  return picks
}

export async function findAllProfitablePicks() {
  const picks = await ProfitablePickModel.find().sort({ matchStartTime: -1 })

  return picks
}

interface IUpdateProfitablePickArgs {
  pickId: string
  status: PickStatusEnum
  matchNiceStatus: string
  profit?: number
  isPickWin?: boolean
  score?: string
}

export async function updateProfitablePick(args: IUpdateProfitablePickArgs) {
  console.log(args)

  const updatedPick = await ProfitablePickModel.updateOne(
    { _id: args.pickId },
    {
      $set: {
        status: args.status,
        matchNiceStatus: args.matchNiceStatus,
        score: args.score,
        isPickWin: args.isPickWin,
      },
    },
  )

  return updatedPick
}
