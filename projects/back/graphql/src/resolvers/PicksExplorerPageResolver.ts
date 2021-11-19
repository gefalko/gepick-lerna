import { Resolver, ObjectType, Field, Query, InputType, Arg } from 'type-graphql'
import { Match } from '@gepick/database'
import { findDayPicksBySettings } from '@gepick/database/src/functions/predictions2Picks/predictions2Picks'
import calculatePicksStatistic from '@gepick/database/src/functions/predictions2Picks/utils/calculatePicksStatistics'

@InputType()
class PicksExplorerPagePicksInput {
  @Field(() => String)
  public botDockerImage!: string

  @Field(() => Number)
  public betLabelId!: number

  @Field(() => String)
  public bet!: string

  @Field(() => String)
  public day!: string

  @Field(() => Number)
  public probabilityFrom!: number

  @Field(() => Number)
  public probabilityTo!: number

  @Field(() => Number)
  public valueFrom!: number

  @Field(() => Number)
  public valueTo!: number

  @Field(() => Number)
  public oddProbabilityFrom!: number

  @Field(() => Number)
  public oddProbabilityTo!: number

  @Field(() => Number)
  public oddIndex!: number
}

@ObjectType()
class PicksExplorerPagePick {
  @Field(() => Match)
  match: Match

  @Field(() => Number)
  probability: number

  @Field(() => Number, { nullable: true })
  oddProbability: number

  @Field(() => Number, { nullable: true })
  value: number

  @Field(() => Number, { nullable: true })
  profit: number

  @Field(() => Number, { nullable: true })
  odd?: number

  @Field(() => String, { nullable: true })
  bookmakerName?: string

  @Field(() => Boolean, { nullable: true })
  isPickWin: boolean
}

@ObjectType()
class PicksExplorerPageStatistic {
  @Field(() => Number)
  total: number

  @Field(() => Number)
  totalFinished: number

  @Field(() => Number)
  totalCorrect: number

  @Field(() => Number)
  totalNotCorrect: number

  @Field(() => Number)
  totalProfit: number

  @Field(() => Number)
  profitPerPick: number

  @Field(() => Number)
  averageOdd: number

  @Field(() => Number)
  correctAverageOdd: number
}

@ObjectType()
class PicksExplorerPagePicksResponse {
  @Field(() => [PicksExplorerPagePick])
  picks: PicksExplorerPagePick[]

  @Field(() => PicksExplorerPageStatistic)
  statistic: PicksExplorerPageStatistic
}

@Resolver()
class PicksExplorerPageResolver {
  @Query(() => PicksExplorerPagePicksResponse)
  async picksExplorerPagePicks(@Arg('args') args: PicksExplorerPagePicksInput) {
    const dayPicks = await findDayPicksBySettings({
      day: args.day,
      settings: {
        botDockerImage: args.botDockerImage,
        betLabelId: args.betLabelId,
        bet: args.bet,
        oddIndex: args.oddIndex,
        valueFrom: args.valueFrom,
        valueTo: args.valueTo,
        probabilityFrom: args.probabilityFrom,
        probabilityTo: args.probabilityTo,
        oddProbabilityFrom: args.oddProbabilityFrom,
        oddProbabilityTo: args.oddProbabilityTo,
      },
    })

    const dayStatistics = calculatePicksStatistic({ picks: dayPicks })

    return { statistic: dayStatistics, picks: dayPicks }
  }
}

export default PicksExplorerPageResolver
