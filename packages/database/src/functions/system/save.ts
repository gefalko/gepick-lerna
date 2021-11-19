import SystemModel from '../../models/system/SystemModel'
import { SystemKey } from '../../utils'

interface IUpdateSystemSettingsData {
  lastFreePort: number
}

export async function updateSystemSettings(data: IUpdateSystemSettingsData) {
  const systemSettings = await SystemModel.findOneAndUpdate(
    {
      key: SystemKey.SYSTEM_SETTINGS,
    },
    { lastFreePort: data.lastFreePort },
    { upsert: true },
  )

  return systemSettings?.toObject()
}
