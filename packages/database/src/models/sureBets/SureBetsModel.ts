import * as mongoose from 'mongoose'
import { ObjectType, Field, registerEnumType } from 'type-graphql'
import { prop, getModelForClass, arrayProp } from '@typegoose/typegoose'
import { BetLabelIdEnum } from '@gepick/utils'
import { Match } from '../match/MatchModel'

registerEnumType(BetLabelIdEnum, {
  name: 'BetLabelIdEnum',
})

@ObjectType()
export class SureBetOddsValue {
  @Field(() => Number)
  @prop({ required: true })
  public odd: number

  @Field(() => Number)
  @prop({ required: true })
  public bookmakerId!: number

  @Field()
  @prop({ required: true })
  public value: string

  constructor(odd: number, value: string, bookmakerId: number) {
    this.odd = odd
    this.value = value
    this.bookmakerId = bookmakerId
  }
}

@ObjectType()
class SureBetOdds {
  @Field(() => Number)
  @prop({ required: true })
  public profit: number

  @Field(() => Date)
  @prop({ required: true })
  public createdAt: Date

  @Field(() => [SureBetOddsValue])
  @arrayProp({ items: SureBetOddsValue, _id: false })
  public values: SureBetOddsValue[]

  constructor(profit: number, createdAt: Date, values: SureBetOddsValue[]) {
    this.profit = profit
    this.values = values
    this.createdAt = createdAt
  }
}

@ObjectType()
export class SureBets {
  @Field(() => Match)
  @prop({ ref: Match, required: true })
  public match!: Match

  @Field()
  @prop({ required: true })
  public matchId!: string

  @Field()
  @prop({ required: true })
  public day!: string

  @Field()
  @prop({ required: true, unique: true })
  public apiFootballFixtureId!: number

  @Field(() => BetLabelIdEnum)
  @prop({ required: true })
  betLabelId!: BetLabelIdEnum

  @Field(() => [SureBetOdds])
  @arrayProp({ items: SureBetOdds, _id: false })
  sureBetOddsList!: SureBetOdds[]
}

const SureBetsModel = getModelForClass(SureBets, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'sureBets' },
})

export default SureBetsModel
