import * as mongoose from 'mongoose'
import { ObjectType, Field } from 'type-graphql'
import { getModelForClass, prop, arrayProp } from '@typegoose/typegoose'
import { Pick } from '../pick/PickModel'

@ObjectType()
export class BotPicks {
  @Field()
  public _id?: string

  @Field(() => Date)
  @prop({ required: true })
  day!: Date

  @Field()
  @prop({ required: true })
  botTag!: string

  @Field()
  @prop({ required: true })
  botDbId!: string

  @Field()
  @prop({ required: true })
  bet!: string

  @arrayProp({ ref: Pick, items: Pick })
  @Field(() => [Pick])
  picks!: Pick[]
}

const BotPicksModel = getModelForClass(BotPicks, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'botPicks' },
})

export default BotPicksModel
