import { ObjectType, Field } from 'type-graphql'
import { prop, getModelForClass} from '@typegoose/typegoose'
import * as mongoose from 'mongoose'
import { Country } from '../country/CountryModel'

@ObjectType()
export class Team {
  @Field()
  public _id!: string

  @Field()
  @prop({ required: true, unique: true })
  public apiFootballTeamId!: number

  @Field()
  @prop({ required: true })
  public name!: string

  @Field()
  @prop({ required: true })
  public isNational!: string

  @Field({ nullable: true })
  @prop()
  public logo?: string

  @Field(() => Country, { nullable: true })
  @prop({ ref: Country })
  public country?: Country

  @Field({ nullable: true })
  @prop()
  public countryName?: string

  @Field({ nullable: true })
  @prop()
  public founded?: Number

  @Field({ nullable: true })
  @prop()
  public vanueName?: string

  @Field({ nullable: true })
  @prop()
  public vanueSurface?: string

  @Field({ nullable: true })
  @prop()
  public vanueAddress?: string

  @Field({ nullable: true })
  @prop()
  public vanueCity?: string

  @Field({ nullable: true })
  @prop()
  public vanueCapacity?: string
}

const TeamModel = getModelForClass(Team, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'teams' },
})

export default TeamModel
