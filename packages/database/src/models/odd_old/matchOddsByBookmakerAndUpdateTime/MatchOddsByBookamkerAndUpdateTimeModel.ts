import * as mongoose from 'mongoose'
import { ObjectType, Field } from 'type-graphql'
import { getModelForClass, prop, arrayProp } from '@typegoose/typegoose'

@ObjectType()
class OddBetValue {
  @Field()
  @prop()
  public betValue: string // home | draw | away | under 0.5 ....

  @Field(() => Number)
  @prop()
  public oddSize: number

  constructor(betValue: string, oddSize: number) {
    this.betValue = betValue
    this.oddSize = oddSize
  }
}

@ObjectType()
export class MatchOddByUpdateTime {
  @Field(() => Number)
  @prop()
  updateAt!: number

  @Field()
  @prop({ required: true })
  matchId!: string

  @Field(() => Number)
  @prop({ required: true })
  apiFootballBookamkerId!: number

  @Field(() => [OddBetValue])
  @arrayProp({ items: OddBetValue, _id: false })
  value!: OddBetValue[]
}

const MatchOddByUpdateTimeModel = getModelForClass(MatchOddByUpdateTime, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'matchOddByUpdateTime' },
})

export default MatchOddByUpdateTimeModel
