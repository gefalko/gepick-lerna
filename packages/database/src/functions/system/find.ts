import SystemModel from '../../models/system/SystemModel'
import { SystemKey } from '../../utils'

export async function findSystemSettings() {
  const systemSettings = await SystemModel.findOne({ key: SystemKey.SYSTEM_SETTINGS })

  return systemSettings?.toObject()
}
