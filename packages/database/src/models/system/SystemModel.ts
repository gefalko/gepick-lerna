import * as mongoose from 'mongoose'
import { ObjectType, Field } from 'type-graphql'
import { prop, getModelForClass } from '@typegoose/typegoose'

@ObjectType()
export class System {
  @Field()
  @prop({ required: true })
  key!: string

  @Field(() => Number)
  @prop({ required: true })
  lastFreePort!: number
}

const SystemModel = getModelForClass(System, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'system' },
})

export default SystemModel
