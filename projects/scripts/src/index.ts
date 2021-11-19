import { cmd, printlog, ScriptsNamesEnum } from '@gepick/utils'
import startCalculateBotPredictions from '../calculateBotPredictions'
import startCollectDayMatches from '../api-football/collectDayMatches'
import startCollectDayMatchesHistoricalMatches from '../api-football/collectDayMatchesHistoricalMatches'
import startCollectDayMatchesOdds from '../api-football/collectDayMatchesOdds'
import startGenerateBotsReports from '../generateBotsReports'
import collectBotBetValuePicksByDay from '../collectBotBetValuePicksByDay_old'
import migrateDb from '../dbMigrate'
import updateResultsAndPicksStatus from '../updateResults'
import createBookmakerExplorerReports from '../bookmakerExplorer/createBookmakerExplorerReports'
import updateBookmakerExplorerReportStatistic from '../bookmakerExplorer/updateBookmakerExplorerReportStatistic'
import searchSureBets from '../sureBets/searchSureBets'
import collectProfitablePicks from '../profitablePicks/collectProfitablePicks'
import updateProfitablePicks from '../profitablePicks/updateProfitablePicks'

if (!cmd.script) {
  throw new Error('--script arg is required.')
}

async function start() {
  switch (cmd.script) {
    case ScriptsNamesEnum.calculateBotPredictions:
      await startCalculateBotPredictions()
      break
    case ScriptsNamesEnum.collectDayMatches:
      await startCollectDayMatches()
      break
    case ScriptsNamesEnum.collectDayMatchesOdds:
      await startCollectDayMatchesOdds()
      break
    case ScriptsNamesEnum.collectDayMatchesHistoricalMatches:
      await startCollectDayMatchesHistoricalMatches()
      break
    case ScriptsNamesEnum.collectBotBetValuePicksByDay:
      await collectBotBetValuePicksByDay()
      break
    case ScriptsNamesEnum.generateBotsReports:
      await startGenerateBotsReports()
      break
    case ScriptsNamesEnum.migrateDb:
      await migrateDb()
      break
    case ScriptsNamesEnum.updateResults:
      await updateResultsAndPicksStatus()
      break
    case ScriptsNamesEnum.createBookmakerExplorerReports:
      await createBookmakerExplorerReports()
      break
    case ScriptsNamesEnum.updateBookmakerExplorerReportsStatistics:
      await updateBookmakerExplorerReportStatistic()
      break
    case ScriptsNamesEnum.searchSureBets:
      await searchSureBets()
      break
    case ScriptsNamesEnum.collectProfitablePicks:
      await collectProfitablePicks()
      break
    case ScriptsNamesEnum.updateProfitablePicks:
      await updateProfitablePicks()
      break
    default:
      printlog(cmd.script + ' not exist')
  }
  printlog('DONE!')
}

start()
