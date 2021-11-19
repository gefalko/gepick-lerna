import * as mongoose from 'mongoose'
import { ObjectType, Field } from 'type-graphql'
import { getModelForClass, prop, arrayProp } from '@typegoose/typegoose'
import { Pick } from '../pick/PickModel'

@ObjectType()
export class BotBetValuePicksByDay {
  @Field()
  public _id?: string

  @Field(() => Date)
  @prop({ required: true })
  day!: Date

  @Field()
  @prop({ required: true })
  botDockerImage!: string

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

const BotBetValuePicksByDayModel = getModelForClass(BotBetValuePicksByDay, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'botBetValuePicksByDay' },
})

export default BotBetValuePicksByDayModel
