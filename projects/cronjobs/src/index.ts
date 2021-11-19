import { CronJob } from 'cron'
import * as moment from 'moment'
import collectDayMatchesHistoricalMatches from '@gepick/tasks/src/collectDayMatchesHistoricalMatches/collectDayMatchesHistoricalMatches'
import collectDayMatchesOdds from '@gepick/tasks/src/collectDayMatchesOdds/collectDayMatchesOdds'
import { connectToDb } from '@gepick/database'
import { collectDayMatches, updatePicksStatus, updateMatchesResults } from '@gepick/tasks'
import createDailyBookmakerExplorerReport from '@gepick/tasks/src/bookmakerExplorerReports/createDailyBookmakerExplorerReport'
import createWeeklyBookmakerExplorerReport from '@gepick/tasks/src/bookmakerExplorerReports/createWeeklyBookmakerExplorerReport'
import updateReportStatisticTask from '@gepick/tasks/src/bookmakerExplorerReports/updateBookmakerExplorerReportStatistic'
import calculateBotPredictions from '@gepick/tasks/src/calculateBotPredictions/calculateBotPredictions'
import { printlog } from '@gepick/utils'
import searchSureBets from '@gepick/tasks/src/searchSureBets/searchSureBets'

const SURE_BETS_ENABLE = false

async function runJobs() {
  await connectToDb()

  printlog('INIITIALIZATION DONE! WAITING JOBS')

  /* eslint-disable no-new */
  const collectDayDataCronJob = new CronJob(
    '0 5 * * *',
    async function () {
      printlog('Collect today data.')
      const today = moment().format('YYYY-MM-DD')
      const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
      await updateMatchesResults()
      await updatePicksStatus()
      await collectDayMatches(today)
      await collectDayMatchesHistoricalMatches(today)
      await collectDayMatchesOdds(today)
      await createDailyBookmakerExplorerReport(yesterday)
      await updateReportStatisticTask()
      await calculateBotPredictions(today)
      printlog('Collect today data. DONE!')
    },
    null,
    false,
    'Europe/Vilnius',
  )

  /* eslint-disable no-new */
  const resultsUpdateCronJob = new CronJob(
    '40 * * * *',
    async function () {
      printlog('Update results and picks.')
      await updateMatchesResults()
      await updatePicksStatus()
      printlog('Update results and picks. DONE!')
    },
    null,
    false,
    'Europe/Vilnius',
  )

  const searchSureBetsCronJob = new CronJob(
    '0 */3 * * *',
    async function () {
      printlog('Searching sure bets.')
      const today = moment().format('YYYY-MM-DD')
      await searchSureBets(today)
      printlog('Searching sure bets. DONE!')
    },
    null,
    false,
    'Europe/Vilnius',
  )

  const weeklyBookmakerExplorerReportCronJob = new CronJob(
    '0 3 * * 1',
    async function () {
      const week = moment().isoWeek() - 1
      const year = moment().year()
      printlog('Update weekly bookmaker explorer report.')
      await createWeeklyBookmakerExplorerReport(year, week === 0 ? 1 : week)
    },
    null,
    false,
    'Europe/Vilnius',
  )

  collectDayDataCronJob.start()
  resultsUpdateCronJob.start()
  if (SURE_BETS_ENABLE) {
    searchSureBetsCronJob.start()
  }
  weeklyBookmakerExplorerReportCronJob.start()
}

runJobs()
