import * as mongoose from 'mongoose'
import { ObjectType, Field } from 'type-graphql'
import { getModelForClass, arrayProp } from '@typegoose/typegoose'
import { MatchOdds } from '../matchOdds/MatchOddsModel'

@ObjectType()
export class IdList {
  @Field(() => [MatchOdds], { nullable: true })
  @arrayProp({ itemsRef: MatchOdds, items: MatchOdds })
  matchOdds?: MatchOdds[]
}

const IdListModel = getModelForClass(IdList, {
  existingMongoose: mongoose,
  schemaOptions: { collection: 'idList' },
})

export default IdListModel
