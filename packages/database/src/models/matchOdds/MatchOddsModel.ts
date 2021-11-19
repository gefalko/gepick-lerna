import * as mongoose from 'mongoose'
import { ObjectType, Field } from 'type-graphql'
import { getModelForClass, prop, arrayProp } from '@typegoose/typegoose'

@ObjectType()
export class OddBybet {
  @Field()
  @prop()
  public bet: string // home | draw | away | under 0.5 ....

  @Field(() => Number)
  @prop()
  public oddSize: number

  constructor(bet: string, oddSize: number) {
    this.bet = bet
    this.oddSize = oddSize
  }
}

@ObjectType()
export class MatchOdds {
  @Field(() => Number)
  @prop({ required: true })
  apiFootballBookamkerId!: number

  @Field(() => Number)
  @prop({ required: true })
  betLabelId!: number

  @Field(() => Number)
  @prop({ required: true })
  updateAt!: number

  @Field()
  @prop({ required: true })
  matchId!: string

  @Field()
  @prop({ required: true })
  matchStartDay!: string

  @Field(() => [OddBybet])
  @arrayProp({ items: OddBybet, _id: false })
  oddsByBet!: OddBybet[]
}

const MatchOddsModel = getModelForClass(MatchOdds, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'matchOdds' },
})

export default MatchOddsModel
