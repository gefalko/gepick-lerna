import { printlog } from '@gepick/utils'
import IdListModel, { IdList } from './IdListModel'

export async function createIdList(idList: IdList) {
  try {
    const dbIdList = await new IdListModel(idList).save()

    return dbIdList
  } catch (err) {
    printlog('Failed save idList')
    throw err
  }
}
