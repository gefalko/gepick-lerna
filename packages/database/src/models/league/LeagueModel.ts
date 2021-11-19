import * as mongoose from 'mongoose'
import { map } from 'lodash'
import { ObjectType, Field, registerEnumType } from 'type-graphql'
import { prop, Ref, getModelForClass, arrayProp } from '@typegoose/typegoose'
import { LeagueTypeEnum, SeasonEnum } from '../../types'
import { Country } from '../country/CountryModel'

const seasonEnumValues = map(SeasonEnum, (value) => value)

interface IFixtures {
  events: boolean
  lineups: boolean
  statistics: boolean
  players_statistics: boolean
}

registerEnumType(SeasonEnum, {
  name: 'SeasonEnum', // this one is mandatory
})

@ObjectType()
class ApiFootballCoverage {
  @Field(() => Boolean)
  @prop()
  public standings: boolean

  @Field(() => Boolean)
  @prop()
  public players: boolean

  @Field(() => Boolean)
  @prop()
  public topScorers: boolean

  @Field(() => Boolean)
  @prop()
  public predictions: boolean

  @Field(() => Boolean)
  @prop()
  public odds: boolean

  @prop()
  public fixtures: IFixtures

  constructor(
    standings: boolean,
    players: boolean,
    topScorers: boolean,
    predictions: boolean,
    odds: boolean,
    fixtures: IFixtures,
  ) {
    this.standings = standings
    this.players = players
    this.topScorers = topScorers
    this.predictions = predictions
    this.odds = odds
    this.fixtures = fixtures
  }
}

@ObjectType()
export class Season {
  @Field(() => SeasonEnum)
  @prop({ required: true, enum: seasonEnumValues })
  public season!: SeasonEnum

  @Field()
  @prop({ required: true })
  public seasonStart!: string

  @Field()
  @prop({ required: true })
  public seasonEnd!: string

  @Field(() => Number)
  @prop()
  public standings?: number

  @Field(() => ApiFootballCoverage)
  @prop({ _id: false })
  public apiFootballCoverage?: ApiFootballCoverage

  @Field(() => Number)
  @prop({ required: true, unique: true })
  public apiFootballLeagueId!: number

  constructor(
    season: SeasonEnum,
    seasonStart: string,
    seasonEnd: string,
    standings: number,
    apiFootballCoverage: ApiFootballCoverage,
    apiFootballLeagueId: number,
  ) {
    this.season = season
    this.seasonStart = seasonStart
    this.seasonEnd = seasonEnd
    this.standings = standings
    this.apiFootballCoverage = apiFootballCoverage
    this.apiFootballLeagueId = apiFootballLeagueId
  }
}

@ObjectType()
export class League {
  @Field()
  public _id?: string

  @Field()
  @prop({ required: true })
  public name!: string

  @Field()
  @prop({ required: true, enum: Object.keys(LeagueTypeEnum) })
  public type!: LeagueTypeEnum

  @prop({ ref: Country, required: true })
  public country!: Ref<Country>

  @Field()
  @prop({ required: true })
  public countryName!: string

  @prop()
  public countryCode?: string

  @prop()
  @Field({ nullable: true })
  public logo?: string

  @prop()
  @Field({ nullable: true })
  public flag?: string

  @Field(() => [Season], { nullable: true })
  @arrayProp({ items: Season, _id: false })
  public seasons?: Season[]
}

const LeagueModel = getModelForClass(League, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'leagues' },
})

export default LeagueModel
