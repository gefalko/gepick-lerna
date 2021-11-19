import { printlog } from '@gepick/utils'
import PickModel, { Pick } from './PickModel'
import { PickStatusEnum } from '../../types'

export async function createPick(pickData: Pick | null) {
  try {
    if (pickData) {
      const pick = await new PickModel(pickData).save()

      return pick
    }

    throw new Error('createPick failed')
  } catch (err) {
    printlog('Create pick failed.')
    throw err
  }
}

export async function createPicks(picks: (Pick | null)[]) {
  const promises = picks.map(createPick)

  return Promise.all(promises)
}

export async function findPendingPicks() {
  const picks = await PickModel.find({
    status: PickStatusEnum.PENDING,
  }).populate({ path: 'match' })

  return picks
}

export function removePicks(ids: string[]) {
  const res = PickModel.remove({ _id: { $in: ids } })
  return res
}
