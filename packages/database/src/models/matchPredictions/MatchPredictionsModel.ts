import * as mongoose from 'mongoose'
import { ObjectType, Field } from 'type-graphql'
import { getModelForClass, prop, arrayProp } from '@typegoose/typegoose'

export type IMatchPredictions = Partial<MatchPredictions>

@ObjectType()
export class PredictionByBet {
  @Field()
  @prop({ required: true })
  public bet: string // Home Draw Away etc.

  @Field()
  @prop({ required: true })
  public probability: number

  constructor(bet: string, probability: number) {
    this.bet = bet
    this.probability = probability
  }
}

@ObjectType()
export class MatchPredictions {
  @Field()
  public _id?: string

  @Field()
  @prop({ required: true })
  botDockerImage!: string

  @Field()
  @prop({ required: true })
  matchId!: string

  @Field()
  @prop({ required: true })
  matchStartTime!: Date

  @Field(() => Number)
  @prop({ required: true })
  betLabelId!: number

  @Field()
  @prop({ required: true })
  createTime!: Date

  @Field(() => [PredictionByBet])
  @arrayProp({ items: PredictionByBet, _id: false })
  predictionsByBet!: PredictionByBet[]
}

const MatchPredictionsModel = getModelForClass(MatchPredictions, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'matchPredictions' },
})

export default MatchPredictionsModel
