import { Ctx, Arg, Resolver, Query, Field, InputType, ObjectType } from 'type-graphql'
import * as moment from 'moment'
import { sortBy } from 'lodash'
import { findSureBetsByDay } from '@gepick/database/src/models/sureBets/functions'
import { SureBets } from '@gepick/database/src/models/sureBets/SureBetsModel'
import { isPatron } from '@gepick/database'
import { IContext } from 'utils/utils'

@InputType()
class SureBetsQueryInput {
  @Field(() => String)
  public day!: string
}

@ObjectType()
class LockedSureBets {
  @Field(() => Date)
  matchStartTime: Date

  @Field(() => Number)
  profit: number
}

@ObjectType()
class SureBetsResponse {
  @Field(() => [SureBets])
  unlockedSureBets: SureBets[]

  @Field(() => [LockedSureBets])
  lockedSureBets: LockedSureBets[]
}

@Resolver()
class SureBetsPageResolver {
  @Query(() => SureBetsResponse)
  async sureBets(@Ctx() ctx: IContext, @Arg('args') args: SureBetsQueryInput) {
    const sureBets = await findSureBetsByDay(args.day)
    const userIsPatron = ctx.user?.id ? await isPatron(ctx.user?.id) : false
    const isToday = moment().format('YYYY-MM-DD') === args.day

    const formatedSureBets = sureBets.map((sureBetsItem) => {
      const sorted = sortBy(sureBetsItem.sureBetOddsList, 'createdAt')

      return {
        ...(sureBetsItem as any)._doc,
        sureBetOddsList: sorted[0] ? [sorted[0]] : [],
      }
    })

    const sortedByProfit = sortBy(formatedSureBets, 'sureBetOddsList[0].profit').reverse()

    const patreonProfit = 0.05
    const maxProfit = 0.25

    const getLockedSureBets = () => {
      if (userIsPatron || !isToday) {
        return []
      }

      const lockedList = sortedByProfit.filter((item) => {
        const last = item.sureBetOddsList[0]
        return last.profit > patreonProfit && last.profit < maxProfit
      })

      return lockedList.map((item: SureBets) => {
        const last = item.sureBetOddsList[0]
        return {
          matchStartTime: item.match.startTime,
          profit: last.profit,
        }
      })
    }

    const getUnlockedSureBets = () => {
      if (userIsPatron || !isToday) {
        return sortedByProfit
      }

      const unlockedList = sortedByProfit.filter((item: SureBets) => {
        const last = item.sureBetOddsList[0]
        return last.profit < patreonProfit && last.profit < maxProfit
      })

      return unlockedList
    }

    return {
      lockedSureBets: getLockedSureBets(),
      unlockedSureBets: getUnlockedSureBets(),
    }
  }
}

export default SureBetsPageResolver
