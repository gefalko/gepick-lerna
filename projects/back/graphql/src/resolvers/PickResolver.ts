import * as moment from 'moment'
import { sumBy, round } from 'lodash'
import { Ctx, Resolver, Query, ObjectType, Field } from 'type-graphql'
import { PickStatusEnum } from '@gepick/database/src/types'
import { Pick, findAccountPicksByEmail, findAccountById, Match } from '@gepick/database'
import { IContext } from 'utils/utils'

@ObjectType()
class LockedPick {
  @Field()
  startTime: Date

  @Field()
  public bet!: string

  @Field()
  public probability!: string
}

@ObjectType()
class PicksStatistic {
  @Field(() => Number)
  public thisWeekProfit!: number

  @Field(() => Number)
  public thisMonthProfit!: number

  @Field(() => Number)
  public thisYearProfit!: number

  @Field(() => Number)
  public totalProfit!: number

  @Field(() => Number)
  public totalPicks!: number

  @Field(() => Number)
  public correctPicks!: number

  @Field(() => Number)
  public wrongPicks!: number

  @Field(() => Number)
  public cancelPicks!: number

  @Field(() => Number)
  public pendingPicks!: number

  @Field(() => Number)
  public profitPerPick!: number

  @Field(() => Number)
  public avarageOdd!: number
}

@ObjectType()
class VipPageData {
  @Field(() => [Pick])
  public finishedPicks!: Pick[]

  @Field(() => [Pick])
  public unlockedPicks!: Pick[]

  @Field(() => [LockedPick])
  public lockedPicks!: LockedPick[]

  @Field(() => PicksStatistic)
  public statistics!: PicksStatistic
}

@Resolver()
class PickResolver {
  @Query(() => VipPageData)
  async vipPageData(@Ctx() ctx: IContext) {
    const picks = await findAccountPicksByEmail('karka.edgaras@gmail.com')

    const isPatroniFn = async () => {
      if (!ctx.user?.id) {
        return false
      }
      const user = await findAccountById(ctx.user.id)

      const userIsPatron = (user?.patreonData?.will_pay_amount_cents ?? 0) > 0

      return userIsPatron
    }

    const isPatron = await isPatroniFn()

    const getUnlockedPicks = () => {
      if (isPatron) {
        const pendingPicks = picks.filter((pick) => pick.status === PickStatusEnum.PENDING)
        return pendingPicks
      }
      return []
    }

    const getLockedPicks = () => {
      if (!isPatron) {
        const pendingPicks = picks.filter((pick) => pick.status === PickStatusEnum.PENDING)
        return pendingPicks.map((pick) => {
          return { startTime: pick.startTime, bet: pick.bet, probability: pick.probability }
        })
      }

      return []
    }

    const getFinishedPicks = () => {
      return picks.filter((pick) => pick.status !== PickStatusEnum.PENDING)
    }

    const getStatistics = () => {
      const today = moment()
      const startOfWeek = today.startOf('week')
      const startOfMonth = today.startOf('month')
      const startOfYear = today.startOf('year')

      const thisWeekPicks = picks.filter((pick) => moment((pick.match as Match).startTime).isAfter(startOfWeek))
      const thisMonthPicks = picks.filter((pick) => moment((pick.match as Match).startTime).isAfter(startOfMonth))
      const thisYearPicks = picks.filter((pick) => moment((pick.match as Match).startTime).isAfter(startOfYear))

      const correctPicksLength = picks.filter((pick) => pick.status === PickStatusEnum.CORRECT).length
      const cancelPicksLength = picks.filter((pick) => pick.status === PickStatusEnum.CANCELED).length
      const wrongPicksLength = picks.filter((pick) => pick.status === PickStatusEnum.NOT_CORRECT).length
      const pendingPicksLength = picks.filter((pick) => pick.status === PickStatusEnum.PENDING).length
      const finishedPicksLength = correctPicksLength + wrongPicksLength

      const oddsSum = sumBy(picks, 'oddSize')

      const round2 = (value?: number) => {
        return round(value ?? 0, 2)
      }

      const totalProfit = round2(sumBy(picks, 'profit'))

      return {
        thisWeekProfit: round2(sumBy(thisWeekPicks, 'profit')),
        thisMonthProfit: round2(sumBy(thisMonthPicks, 'profit')),
        thisYearProfit: round2(sumBy(thisYearPicks, 'profit')),
        totalProfit,
        totalPicks: picks.length,
        correctPicks: correctPicksLength,
        cancelPicks: cancelPicksLength,
        wrongPicks: wrongPicksLength,
        pendingPicks: pendingPicksLength,
        profitPerPick: finishedPicksLength ? round2(totalProfit / finishedPicksLength) : 0,
        avarageOdd: finishedPicksLength ? round2(oddsSum / picks.length) : 0,
      }
    }

    const result = {
      finishedPicks: getFinishedPicks(),
      unlockedPicks: getUnlockedPicks(),
      lockedPicks: getLockedPicks(),
      statistics: getStatistics(),
    }

    return result
  }
}

export default PickResolver
