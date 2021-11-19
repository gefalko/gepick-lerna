import * as mongoose from 'mongoose'
import { ObjectType, Field, registerEnumType } from 'type-graphql'
import { prop, getModelForClass, arrayProp } from '@typegoose/typegoose'
import { MatchStatusEnum } from '../../types'
import { Team } from '../team/TeamModel'
import { League } from '../league/LeagueModel'
import { Country } from '../country/CountryModel'
import { MatchOdds } from '../matchOdds/MatchOddsModel'

registerEnumType(MatchStatusEnum, {
  name: 'MatchStatusEnum',
})

@ObjectType()
class Score {
  @prop()
  @Field({ nullable: true })
  public halftime: string

  @prop()
  @Field({ nullable: true })
  public fulltime?: string

  @prop()
  @Field({ nullable: true })
  public extratime?: string

  @prop()
  @Field({ nullable: true })
  public penalty?: string

  constructor(halftime: string, fulltime: string, extratime: string, penalty: string) {
    this.halftime = halftime
    this.fulltime = fulltime
    this.extratime = extratime
    this.penalty = penalty
  }
}

@ObjectType()
export class Match {
  @Field()
  public _id?: string

  @Field()
  @prop({ required: true, unique: true })
  public apiFootballFixtureId!: number

  @Field(() => Date)
  @prop({ required: true })
  public startTime!: Date

  @Field(() => Team)
  @prop({ ref: Team, required: true })
  public homeTeam!: Team

  @Field()
  @prop({ required: true })
  public homeTeamName!: string

  @Field(() => Team)
  @prop({ ref: Team, required: true })
  public awayTeam!: Team

  @Field()
  @prop({ required: true })
  public awayTeamName!: string

  @Field(() => Number)
  @prop({ required: true })
  public seasionApiFootballLeagueId!: number

  @Field(() => League)
  @prop({ ref: League, required: true })
  public league!: League

  @prop({ required: true })
  @Field()
  public leagueName!: string

  @Field(() => Country)
  @prop({ ref: Country, required: true })
  public country!: Country

  @prop({ required: true })
  @Field()
  public countryName!: string

  @prop()
  @Field(() => Number, { nullable: true })
  public goalsHomeTeam?: number

  @prop()
  @Field(() => Number, { nullable: true })
  public goalsAwayTeam?: number

  @prop({ required: true, enum: Object.keys(MatchStatusEnum) })
  @Field(() => MatchStatusEnum)
  public status!: MatchStatusEnum

  @prop({ required: true })
  @Field()
  public niceStatus!: string

  @prop({ _id: false })
  @Field(() => Score, { nullable: true })
  public score?: Score

  @Field(() => [MatchOdds], { nullable: true })
  @arrayProp({ itemsRef: MatchOdds, items: MatchOdds })
  picks?: MatchOdds[]
}

const MatchModel = getModelForClass(Match, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'matches' },
})

export default MatchModel
