import * as mongoose from 'mongoose'
import { ObjectType, Field } from 'type-graphql'
import { getModelForClass, prop, arrayProp } from '@typegoose/typegoose'
import { BetLabelIdEnum } from '@gepick/utils'
import { MatchOddByUpdateTime } from '../matchOddByUpdateTime/MatchOddByUpdateTimeModel'

@ObjectType()
export class MatchOddByBetLabel {
  @Field(() => BetLabelIdEnum)
  @prop()
  labelId!: BetLabelIdEnum

  @Field()
  @prop({ required: true })
  matchId!: string

  @Field()
  @prop()
  labelName!: string

  @Field(() => [MatchOddByUpdateTime])
  @arrayProp({ ref: MatchOddByUpdateTime, items: MatchOddByUpdateTime })
  oddByUpdateTime!: MatchOddByUpdateTime[]
}

const MatchOddByBetLabelModel = getModelForClass(MatchOddByBetLabel, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'matchOddByBetLabel' },
})

export default MatchOddByBetLabelModel
