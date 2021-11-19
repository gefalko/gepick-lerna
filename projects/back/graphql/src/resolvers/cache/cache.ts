import { CronJob } from 'cron'
import * as moment from 'moment'
import { sortBy } from 'lodash'
import { printlog } from '@gepick/utils'
import { Country } from '@gepick/database/src/models/country/CountryModel'
import { findAllCountries } from '@gepick/database/src/models/country/functions'
import getPredictionPageMatchesV2, { PredictionsPageMatchV2 } from './getPredictionPageMatchesV2'

interface IPredictionsPageMatches {
  [key: string]: PredictionsPageMatchV2[]
}

let predictionsPageMatches: IPredictionsPageMatches = {}

let countries: Country[] | null = null

function getPredictionsPageMatches(day: string) {
  const fromCache = predictionsPageMatches[day]

  return fromCache
}

interface ISetPredictionsPageMatches {
  day: string
  matches: PredictionsPageMatchV2[]
}

async function setPredictionsPageMatches(args: ISetPredictionsPageMatches) {
  predictionsPageMatches[args.day] = args.matches
}

async function getCountries() {
  if (countries) {
    return countries
  }

  const dbCountries = await findAllCountries()
  const sortedCountries = sortBy(dbCountries, 'name')

  return sortedCountries
}

const cache = {
  getPredictionsPageMatches,
  setPredictionsPageMatches,
  getCountries,
}

async function runJobs() {
  printlog('RUN CRON JOBS')

  /* eslint-disable no-new */
  const updatePredictionsPageCacheJob = new CronJob(
    '0 * * * *',
    async function () {
      const today = moment().format('YYYY-MM-DD')
      const matches = await getPredictionPageMatchesV2({
        day: today,
      })
      cache.setPredictionsPageMatches({ day: today, matches })
    },
    null,
    true,
    'Europe/Vilnius',
  )
  updatePredictionsPageCacheJob.start()
}

runJobs()

export default cache
