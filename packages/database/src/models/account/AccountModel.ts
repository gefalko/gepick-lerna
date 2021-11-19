import * as mongoose from 'mongoose'
import { prop, Typegoose, arrayProp } from 'typegoose'
import { ObjectType, Field } from 'type-graphql'
import { Pick } from '../pick/PickModel'

@ObjectType()
class PatreonData {
  @Field()
  @prop()
  accessToken: string

  @Field()
  @prop()
  refreshAccessToken: string

  @Field({ nullable: true })
  @prop()
  patron_status?: string

  @Field(() => Number, { nullable: true })
  @prop()
  currently_entitled_amount_cents?: number

  @Field(() => Number, { nullable: true })
  @prop()
  will_pay_amount_cents?: number

  constructor(
    accessToken: string,
    refreshAccessToken: string,
    patron_status: string,
    currently_entitled_amount_cents: number,
    will_pay_amount_cents: number,
  ) {
    this.accessToken = accessToken
    this.refreshAccessToken = refreshAccessToken
    this.patron_status = patron_status
    this.currently_entitled_amount_cents = currently_entitled_amount_cents
    this.will_pay_amount_cents = will_pay_amount_cents
  }
}

@ObjectType()
export class Account extends Typegoose {
  @Field()
  public _id?: string

  @Field({ nullable: true })
  @prop()
  patreonId?: string

  @Field({ nullable: true })
  @prop()
  facebookId?: string

  @Field({ nullable: true })
  @prop()
  email?: string

  @Field({ nullable: true })
  @prop()
  password?: string

  @Field({ nullable: true })
  @prop()
  fullName?: string

  @Field({ nullable: true })
  @prop()
  thumbUrl?: string

  @Field({ nullable: true })
  @prop()
  isEmailVerified?: boolean

  @Field({ nullable: true })
  @prop()
  verificationToken?: string

  @Field({ nullable: true })
  @prop()
  passwordResetToken?: string

  @Field(() => PatreonData, { nullable: true })
  @prop({ _id: false })
  patreonData?: PatreonData

  @Field(() => [Pick], { nullable: true })
  @arrayProp({ itemsRef: Pick, items: Pick })
  picks?: Pick[]
}

const AccountModel = new Account().getModelForClass(Account, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'accounts' },
})

export default AccountModel
