import * as mongoose from 'mongoose'
import { getModelForClass, prop } from '@typegoose/typegoose'
import { ObjectType, Field } from 'type-graphql'

export enum BookmakerPerformanceReportPeriodEnum {
  DAY = 'day',
}

@ObjectType()
class ReportByInterval {
  @Field(() => Number)
  @prop({ required: true })
  fromInterval!: number

  @Field(() => Number)
  @prop({ required: true })
  toInterval!: number

  @Field(() => Number)
  @prop({ required: true })
  total!: number

  @Field(() => Number)
  @prop({ required: true })
  correct!: number

  @Field(() => Number)
  @prop({ required: true })
  percentage!: number
}

@ObjectType()
class BookmakerPerformanceReportItem {
  @Field(() => Number)
  @prop({ required: true })
  from!: number

  @Field(() => Number)
  @prop({ required: true })
  to!: number

  @Field(() => [ReportByInterval])
  @prop({ required: true, _id: false })
  reportByinterval!: ReportByInterval[]
}

@ObjectType()
class BookmakerPerformanceReport {
  @Field()
  public _id?: string

  @Field(() => BookmakerPerformanceReportPeriodEnum)
  @prop({ required: true, _id: false })
  period!: BookmakerPerformanceReportPeriodEnum

  @Field()
  @prop({ required: true })
  periodValue!: string

  @Field(() => Number)
  @prop({ required: true })
  betLabelId!: number

  @Field()
  @prop({ required: true })
  bet!: string

  @Field(() => [BookmakerPerformanceReportItem])
  @prop({ required: true, _id: false })
  reports!: BookmakerPerformanceReportItem[]
}

const BookmakerPerformanceReportModel = getModelForClass(BookmakerPerformanceReport, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'bookmakerPerformanceReport' },
})

export default BookmakerPerformanceReportModel
