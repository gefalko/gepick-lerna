import * as mongoose from 'mongoose'
import { ObjectType, Field } from 'type-graphql'
import { getModelForClass, prop } from '@typegoose/typegoose'
import { Account } from '../account/AccountModel'

@ObjectType()
export class PredictionBot {
  @Field()
  public _id?: string

  @Field()
  @prop({ required: true, unique: true })
  dockerImage!: string

  @Field()
  @prop()
  gitRepository?: string

  @Field()
  @prop()
  description?: string

  @Field(() => Account)
  @prop({ ref: Account, required: true })
  creator!: Account

  @Field(() => Number)
  @prop({ required: true })
  portNumber!: number

  @Field(() => Boolean)
  @prop({ required: true })
  active!: boolean
}

const PredictionBotModel = getModelForClass(PredictionBot, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'predictionBots' },
})

export default PredictionBotModel
