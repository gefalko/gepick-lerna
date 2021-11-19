import * as mongoose from 'mongoose'
import { cmd, printlog, variables } from '@gepick/utils'
import { SystemKey } from './utils'
import { findSystemSettings } from './functions/system/find'
import SystemModel from './models/system/SystemModel'

const staging = {
  database: 'gepick_v2_staging',
  port: 27017,
  host: 'bb864.l.dedikuoti.lt',
  username: 'gepick_v2_staging',
}

const production = {
  database: 'gepick_v2_production',
  port: 27017,
  host: 'bb864.l.dedikuoti.lt',
  username: 'gepick_v2_production3',
}

export function connectToDb() {
  return new Promise((resolve, reject) => {
    const { username, host, port, database } = cmd.isProduction ? production : staging
    const password = variables.MONGO_DB_PASS

    try {
      mongoose.set('debug', !cmd.isProduction || cmd.debug)
      mongoose.connect(`mongodb://${username}:${password}@${host}:${port}/${database}`)
      printlog('connected')
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

interface ISeedData {
  initialFreePort: number
}

export async function seedDbData(seedData: ISeedData) {
  const systemSettings = await findSystemSettings()

  if (!systemSettings) {
    await new SystemModel({
      key: SystemKey.SYSTEM_SETTINGS,
      lastFreePort: seedData.initialFreePort,
    }).save()
  }
}
