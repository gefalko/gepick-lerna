import { Resolver, ObjectType, Field, Query } from 'type-graphql'
import { findAllProfitablePicks } from '@gepick/database/src/models/profitablePick/functions'
import { ProfitablePick } from '@gepick/database/src/models/profitablePick/ProfitablePickModel'
import calculatePicksStatistic from '@gepick/database/src/functions/predictions2Picks/utils/calculatePicksStatistics'

@ObjectType()
class ProfitablePicksStatistic {
  @Field(() => Number)
  public total!: number

  @Field(() => Number)
  public totalFinished!: number

  @Field(() => Number)
  public totalCorrect!: number

  @Field(() => Number)
  public totalNotCorrect!: number

  @Field(() => Number)
  public totalProfit!: number

  @Field(() => Number)
  public profitPerPick!: number

  @Field(() => Number)
  public averageOdd!: number

  @Field(() => Number)
  public correctAverageOdd!: number
}

@ObjectType()
class ProfitablePicksPageData {
  @Field(() => ProfitablePicksStatistic)
  public statistic!: ProfitablePicksStatistic

  @Field(() => [ProfitablePick])
  public picks!: ProfitablePick[]
}

@Resolver()
class ProfitablePickResolver {
  @Query(() => ProfitablePicksPageData)
  async profitablePicksPageData() {
    const picks = await findAllProfitablePicks()
    const statistic = calculatePicksStatistic({ picks })

    return { picks, statistic }
  }
}

export default ProfitablePickResolver
