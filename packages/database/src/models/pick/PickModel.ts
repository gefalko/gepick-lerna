import * as mongoose from 'mongoose'
import { ObjectType, Field, registerEnumType } from 'type-graphql'
import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { Match } from '../match/MatchModel'
import { PickStatusEnum } from '../../types'

registerEnumType(PickStatusEnum, {
  name: 'PickStatusEnum',
})

@ObjectType()
export class Pick {
  @Field()
  public _id?: string

  @Field(() => Match)
  @prop({ ref: 'Match', required: true })
  public match!: Ref<Match>

  @Field(() => Number)
  @prop({ required: true })
  public oddSize!: number

  @Field(() => Number)
  @prop({ required: true })
  public bookmakerId!: number

  @Field()
  @prop({ required: true, default: new Date() })
  public createTime!: Date

  @Field(() => Date)
  @prop({ required: true })
  public startTime!: Date

  @Field(() => Number)
  @prop({ required: true })
  public probability!: number

  @Field(() => Number, { nullable: true })
  @prop()
  public profit?: number

  @Field()
  @prop({ required: true })
  public botDockerImage!: string

  @Field(() => Number)
  @prop({ required: true })
  public betLabelId!: number

  @Field()
  @prop({ required: true })
  public bet!: string

  @Field(() => PickStatusEnum)
  @prop({ required: true })
  public status!: PickStatusEnum
}

const PickModel = getModelForClass(Pick, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'picks' },
})

export default PickModel
