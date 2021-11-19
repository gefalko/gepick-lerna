import * as mongoose from 'mongoose'
import { ObjectType, Field } from 'type-graphql'
import { getModelForClass, prop, arrayProp } from '@typegoose/typegoose'
import { IntervalKeyType } from '@gepick/utils/src/BookmakerExplorerInterval'

@ObjectType()
export class Statistic {
  @Field()
  @prop({ required: true })
  public day: string

  @Field()
  @prop({ required: true })
  public allTimeRoi: number

  constructor(day: string, allTimeRoi: number) {
    this.day = day
    this.allTimeRoi = allTimeRoi
  }
}

@ObjectType()
export class BookmakerExplorer_intervalReportStatistic {
  @Field()
  public _id?: string

  @Field(() => Number)
  @prop({ required: true })
  public bookmakerId!: number

  @Field(() => Number)
  @prop({ required: true })
  public betLabelId!: number

  @Field(() => String)
  @prop({ required: true })
  public bet!: string

  @Field(() => String)
  @prop({ required: true })
  public intervalKey!: IntervalKeyType

  @Field(() => Statistic)
  @prop({ required: true, _id: false })
  todayStatistic!: Statistic

  @Field(() => [Statistic])
  @arrayProp({ items: Statistic, _id: false })
  daysStatistic!: Statistic[]
}

const BookmakerExplorer_intervalReportStaisticModel = getModelForClass(BookmakerExplorer_intervalReportStatistic, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'bookmakerExplorer_intervalReportStatistic' },
})

export default BookmakerExplorer_intervalReportStaisticModel
