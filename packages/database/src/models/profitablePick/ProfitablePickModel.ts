import * as mongoose from 'mongoose'
import { ObjectType, Field } from 'type-graphql'
import { getModelForClass, prop } from '@typegoose/typegoose'
import { PickStatusEnum } from '../../types'
import { Match } from '../match/MatchModel'

@ObjectType()
export class ProfitablePick {
  @Field(() => Match)
  @prop({ ref: Match, required: true })
  match!: Match

  @Field()
  @prop({ required: true, unique: true })
  key!: string

  @Field()
  @prop({ required: true })
  matchStartTime!: Date

  @Field()
  @prop({ required: true })
  leagueName!: string

  @Field()
  @prop({ required: true })
  betLabelId!: number

  @Field()
  @prop({ required: true })
  bet!: string

  @Field()
  @prop({ required: true })
  betNiceName!: string

  @Field()
  @prop({ required: true })
  countryName!: string

  @Field({ nullable: true })
  @prop()
  countryFlag?: string

  @Field()
  @prop({ required: true })
  homeTeamName!: string

  @Field()
  @prop({ required: true })
  awayTeamName!: string

  @Field(() => Number)
  @prop({ required: true })
  probability!: number

  @Field(() => Number)
  @prop({ required: true })
  oddProbability!: number

  @Field(() => Number)
  @prop({ required: true })
  value!: number

  @Field(() => Number)
  @prop({ required: true })
  odd!: number

  @Field(() => String)
  @prop({ required: true })
  bookmakerName!: string

  @Field(() => PickStatusEnum)
  @prop({ required: true })
  status!: PickStatusEnum

  @Field(() => Number, { nullable: true })
  @prop()
  profit?: number

  @Field({ nullable: true })
  @prop()
  score?: string

  @Field()
  @prop({ required: true })
  matchNiceStatus!: string

  @Field(() => Boolean, { nullable: true })
  @prop()
  isPickWin?: boolean
}

const ProfitablePickModel = getModelForClass(ProfitablePick, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'profitablePick' },
})

export default ProfitablePickModel
