import * as mongoose from 'mongoose'
import { ObjectType, Field } from 'type-graphql'
import { prop, getModelForClass, arrayProp } from '@typegoose/typegoose'

@ObjectType()
export class PartnerUser {
  @Field(() => Date)
  @prop({ required: true })
  createdAt: Date

  constructor(createdAt: Date) {
    this.createdAt = createdAt
  }
}

@ObjectType()
export class Partner {
  @Field()
  @prop({ required: true })
  name!: string

  @Field(() => Number)
  @arrayProp({ items: PartnerUser })
  partnerUsers!: PartnerUser[]

  @Field(() => String, { nullable: true })
  @prop()
  valuePicksUnlockTillDate?: string
}

const PartnerModel = getModelForClass(Partner, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'partner' },
})

export default PartnerModel
