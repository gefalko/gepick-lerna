import * as mongoose from 'mongoose'
import { prop, Typegoose } from 'typegoose'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class Country extends Typegoose {
  @Field()
  public _id!: string

  @Field()
  @prop({ required: true, unique: true })
  name!: string

  @Field({ nullable: true })
  @prop()
  code?: string

  @prop()
  @Field({ nullable: true })
  flag?: string
}

const CountryModel = new Country().getModelForClass(Country, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'countries' },
})

export default CountryModel
