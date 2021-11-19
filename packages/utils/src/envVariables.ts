import args from './cmdArgs'
import printlog from './printlog'
const fs = require('fs')

const dotenv = require('dotenv')

function isFileExist(path: string) {
  try {
    if (fs.existsSync(path)) {
      return true
    }
  } catch (e) {
    printlog(e.message)
  }

  return false
}

function getEnvPath() {
  const localHost = '/Users/gefalko/gepick/gepick-lerna/.env'
  const server = args.isProduction ? '/home/system/gepick3/production/.env' : '/home/system/gepick3/staging/.env'

  if (isFileExist(localHost)) {
    return localHost
  }

  return server
}

const vars = dotenv.config({ path: getEnvPath() }).parsed

if (vars.error) {
  throw vars.error
}

export const variables = {
  GRAPHQL_PORT: vars.GRAPHQL_PORT,
  GRAPHQL_HOST: vars.GRAPHQL_HOST,
  INITIAL_FREE_PORT: vars.INITIAL_FREE_PORT,
  NEW_PREDICTION_BOT_LISTENER_PORT: vars.NEW_PREDICTION_BOT_LISTENER_PORT,
  PREDICTION_BOTS_HUB_DIR: vars.PREDICTION_BOTS_HUB_DIR,
  DOCKER_GRAPHQL_URI: vars.DOCKER_GRAPHQL_URI,
  MONGO_DB_PASS: vars.MONGO_DB_PASS,
}

printlog('args', args)
printlog('envVariables', { ...variables, MONGO_DB_PASS: 'xxxxxxxx' })

export default variables
