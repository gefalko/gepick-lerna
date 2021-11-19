import * as mongoose from 'mongoose'
import { map } from 'lodash'
import { LeagueTypeEnum, SeasonEnum, ILeagueBase } from '../../types'

const seasonEnumValues = map(SeasonEnum, (value) => value)

interface ILeagueModel extends ILeagueBase, mongoose.Document {}

const LeagueSchema = new mongoose.Schema({
  apiFootballLeagueId: { type: Number, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: Object.keys(LeagueTypeEnum), required: true },
  country: { type: String, required: true },
  countryName: { type: String, required: true },
  countryCode: String,
  season: { type: Number, enum: seasonEnumValues },
  seasonStart: { type: String, required: true },
  seasonEnd: { type: String, required: true },
  logo: String,
  flag: String,
  standings: Number,
  isCurrent: Boolean,
  apiFootballCoverage: {
    standings: Boolean,
    fixtures: {
      events: Boolean,
      lineups: Boolean,
      statistics: Boolean,
      players_statistics: Boolean,
    },
    players: Boolean,
    topScorers: Boolean,
    predictions: Boolean,
    odds: Boolean,
  },
})

export default mongoose.model<ILeagueModel>('league', LeagueSchema)
