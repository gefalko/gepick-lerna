import { Schema, model, Document } from 'mongoose'
import { ITeamBase } from '../../types'

interface ITeamModel extends ITeamBase, Document {}

const TeamSchema = new Schema({
  apiFootballTeamId: { type: Number, required: true },
  name: { type: String, required: true },
  code: String,
  logo: String,
  country: { type: String },
  countryName: { type: String },
  isNational: { type: Boolean, required: true },
  founded: Number,
  vanueName: String,
  vanueSurface: String,
  vanueAddress: String,
  vanueCity: String,
  vanueCapacity: String,
})

export default model<ITeamModel>('team', TeamSchema)
