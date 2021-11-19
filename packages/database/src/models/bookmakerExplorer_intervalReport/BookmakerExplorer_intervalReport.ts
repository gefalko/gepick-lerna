import * as mongoose from 'mongoose'
import { getModelForClass, prop, arrayProp, Ref } from '@typegoose/typegoose'
import { ObjectType, Field } from 'type-graphql'
import { ReportPeriodEnum } from '@gepick/utils/src/enums'
import { IntervalKeyType } from '@gepick/utils/src/BookmakerExplorerInterval'
import { IdList } from '../idList/IdListModel'

@ObjectType()
export class BookmakerExplorer_intervalReport {
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

  @Field(() => Number)
  @prop({ required: true })
  public intervalFrom!: number

  @Field(() => Number)
  @prop({ required: true })
  public intervalTo!: number

  @Field(() => String)
  @prop({ required: true })
  public intervalKey!: IntervalKeyType

  @Field(() => ReportPeriodEnum)
  @prop({ required: true })
  public periodType!: ReportPeriodEnum

  @Field(() => Number)
  @prop({ required: true })
  public year!: number

  @Field(() => Number)
  @prop()
  public yearQuarter?: number

  @Field(() => Number)
  @prop()
  public yearMonth?: number

  @Field(() => Number)
  @prop()
  public monthDay?: number

  @Field(() => Number)
  @prop()
  public yearWeek?: number

  @Field(() => Number)
  @prop({ required: true })
  public profit!: number

  @Field(() => Number, { nullable: true })
  @prop()
  public averageOdd!: number | null

  @Field(() => Number, { nullable: true })
  @prop()
  public averageProbability!: number | null

  @Field(() => Number, { nullable: true })
  @prop({ nullable: true })
  public bookmakerOccuracyPercent!: number | null

  @Field(() => Number)
  @prop({ required: true })
  public totalWithResults!: number

  @Field(() => Number)
  @prop({ required: true })
  public totalIncorrect!: number

  @Field(() => Number)
  @prop({ required: true })
  public totalCorrect!: number

  @Field(() => Number, { nullable: true })
  @prop({ nullable: true })
  public diffStatus!: number | null

  /* ids refs to self (BookmakerExplorer_intervalReport) items */

  @Field(() => [String])
  @arrayProp({ items: String, nullable: true })
  public source?: string[]

  @Field(() => IdList)
  @prop({ ref: IdList })
  public odds?: Ref<IdList>
}

const BookmakerExplorer_intervalReportModel = getModelForClass(BookmakerExplorer_intervalReport, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'bookmakerExplorer_intervalReport' },
})

export default BookmakerExplorer_intervalReportModel
