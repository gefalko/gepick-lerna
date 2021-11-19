import { program as args } from 'commander'
import { BetLabelIdEnum } from './BetLabels'
import { ReportPeriodEnum } from './enums'

export enum ScriptsNamesEnum {
  calculateBotPredictions = 'calculateBotPredictions',
  collectDayMatches = 'collectDayMatches',
  collectDayMatchesOdds = 'collectDayMatchesOdds',
  collectDayMatchesHistoricalMatches = 'collectDayMatchesHistoricalMatches',
  collectBotBetValuePicksByDay = 'collectBotBetValuePicksByDay',
  generateBotsReports = 'generateBotsReports',
  migrateDb = 'migrateDb',
  updateResults = 'updateResults',
  createBookmakerExplorerReports = 'createBookmakerExplorerReports',
  updateBookmakerExplorerReportsStatistics = 'updateBookmakerExplorerReportsStatistics',
  searchSureBets = 'searchSureBets',
  collectProfitablePicks = 'collectProfitablePicks',
  updateProfitablePicks = 'updateProfitablePicks',
}

args.option('-p, --isProduction', 'Is production.')
args.option('-d, --day <type>', 'Day.')
args.option('-de, --debug <type>', 'Debug.')
args.option('-s, --script <type>', 'Script name: ' + JSON.stringify(ScriptsNamesEnum, null, 2))
args.option('-i, --index <type>', 'Index.')
args.option('-blid, --betLabelId <type>', 'BetLabelId.')
args.option('-se, --season <type>', 'Season.')
args.option('-mid, --matchId <type>', 'matchId.')
args.option('-y, --year <number>', 'Year')
args.option('-yw, --yearWeek <number>', 'Year week')
args.option('-lid, --seasonLeagueApiId <type>', 'Season league id.')
args.option('-pid, --predictionBotId <type>', 'Prediction bot id.')
args.option('-pbdi, --predictionBotDockerImage <type>', 'Prediction bot docker image.')
args.option('-fid, --apiFootballFixtureId <number>', 'Match apiFootballFixtureId.')
args.option('-df, --dateFrom <string>', 'Date from.')
args.option('-pr, --period <string>', 'Period. ' + JSON.stringify(ReportPeriodEnum, null, 2))
args.parse(process.argv)

interface IProps {
  isProduction?: boolean
  day?: string
  predictionBotId?: string
  predictionBotTag?: string
  apiFootballFixtureId?: number
  script?: string
  season?: number
  seasonLeagueApiId?: number
  predictionBotDockerImage?: string
  matchId: string
  index?: number
  debug?: boolean
  dateFrom?: string
  year?: number
  yearWeek?: number
  period?: ReportPeriodEnum
  betLabelId?: BetLabelIdEnum
}

function validatePeriod(period?: ReportPeriodEnum) {
  if (period !== undefined && !Object.values(ReportPeriodEnum).includes(period)) {
    throw new Error('Perdiod is not correct:' + period)
  }

  return period
}

function validateBetLabelId(betLabel?: BetLabelIdEnum) {
  if (betLabel !== undefined && !Object.values(BetLabelIdEnum).includes(betLabel)) {
    throw new Error('Bet label is not correct:' + betLabel)
  }

  return betLabel
}

export const cmd: IProps = {
  isProduction: args.isProduction,
  day: args.day,
  debug: args.debug,
  predictionBotId: args.predictionBotId,
  apiFootballFixtureId: args.apiFootballFixtureId,
  script: args.script,
  season: args.season,
  seasonLeagueApiId: args.seasonLeagueApiId,
  matchId: args.matchId,
  index: args.index,
  dateFrom: args.dateFrom,
  year: parseInt(args.year, 10),
  yearWeek: parseInt(args.yearWeek, 10),
  period: validatePeriod(args.period),
  betLabelId: validateBetLabelId(args.betLabelId),
}

export default cmd
