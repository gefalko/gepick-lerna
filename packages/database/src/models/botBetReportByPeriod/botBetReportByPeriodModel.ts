import * as mongoose from 'mongoose'
import { ObjectType, Field, registerEnumType } from 'type-graphql'
import { BetTypeEnum } from '@gepick/utils'
import { getModelForClass, prop } from '@typegoose/typegoose'
import { PredictionBot } from '../predictionBot/PredictionBotModel'
import { ReportPeriodEnum } from '@gepick/utils/src/enums'

@ObjectType()
class Report {
  @Field(() => Number)
  @prop({ required: true })
  public total: number

  @Field(() => Number)
  @prop({ required: true })
  public totalCorrect: number

  @Field(() => Number)
  @prop({ required: true })
  public totalWrong: number

  @Field(() => Number)
  @prop({ required: true })
  public totalCanceled: number

  @Field(() => Number)
  @prop({ required: true })
  public totalPending: number

  @Field(() => Number)
  @prop({ required: true })
  public profit: number

  @Field(() => Number, { nullable: true })
  @prop()
  public accuracy?: number

  constructor(
    total: number,
    totalCorrect: number,
    totalWrong: number,
    totalCanceled: number,
    totalPending: number,
    profit: number,
    accuracy: number,
  ) {
    this.total = total
    this.totalCorrect = totalCorrect
    this.totalWrong = totalWrong
    this.totalCanceled = totalCanceled
    this.profit = profit
    this.accuracy = accuracy
    this.totalPending = totalPending
  }
}

@ObjectType()
export class BotBetReportByPeriod {
  @Field()
  public _id?: string

  @Field(() => PredictionBot)
  @prop({ ref: PredictionBot, required: true })
  bot!: PredictionBot

  @Field()
  @prop({ required: true })
  botDockerImage!: string

  @Field()
  @prop({ required: true })
  botDbId!: string

  @Field(() => Date)
  @prop({ required: true })
  dateFrom!: Date

  @Field(() => Date)
  @prop({ required: true })
  dateTo!: Date

  @Field(() => ReportPeriodEnum)
  @prop({ required: true })
  reportPeriod!: ReportPeriodEnum

  @Field(() => BetTypeEnum)
  @prop({ required: true })
  bet!: BetTypeEnum

  @Field(() => Report)
  @prop({ required: true, _id: false })
  report!: Report
}

const BotBetReportByPeriodModel = getModelForClass(BotBetReportByPeriod, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'botBetReportByPeriod' },
})

registerEnumType(ReportPeriodEnum, {
  name: 'ReportPeriodEnum',
})

registerEnumType(BetTypeEnum, {
  name: 'BetTypeEnum',
})

export default BotBetReportByPeriodModel
