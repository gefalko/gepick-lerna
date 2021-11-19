import * as mongoose from 'mongoose'
import { ObjectType, Field } from 'type-graphql'
import { getModelForClass, prop, arrayProp } from '@typegoose/typegoose'
import { MatchOddsByBetLabel } from '../matchOddsByBetLabel/MatchOddsByBetLabel'

@ObjectType()
export class MatchOddsByBookmaker {
  @Field()
  public _id?: string

  @Field(() => Number)
  @prop({ required: true })
  apiFootballBookamkerId!: number

  @Field()
  @prop({ required: true })
  bookmakerName!: string

  @Field()
  @prop({ required: true })
  matchId!: string

  @Field(() => [MatchOddsByBetLabel])
  @arrayProp({ ref: MatchOddsByBetLabel, items: MatchOddsByBetLabel })
  oddsByBetLabel!: MatchOddsByBetLabel[]
}

const MatchOddsByBookmakerModel = getModelForClass(MatchOddsByBookmaker, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'matchOddsByBookmaker' },
})

export default MatchOddsByBookmakerModel
