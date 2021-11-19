import { Ctx, Arg, Resolver, Query, ObjectType, Field, InputType, Float } from 'type-graphql'
import * as moment from 'moment'
import { sortBy, reverse } from 'lodash'
import { IntervalKeyType } from '@gepick/utils/src/BookmakerExplorerInterval'
import { findAllBookmakerExplorerReportStatistic } from '@gepick/database/src/models/bookmakerExplorer_itervalReportStatistic/functions'
import { getBetLabelByLabelId } from '@gepick/utils/src/BetLabels'
import { findMatchOdds } from '@gepick/database/src/models/matchOdds/functions'
import { findMatchesById, isPatron } from '@gepick/database'
import { probabilityToOdd } from '@gepick/utils'
import { calculateStatistic } from '@gepick/utils/src/calculateStatistic'
import { IContext } from 'utils/utils'
import { Partner } from '@gepick/database/src/models/partner/PartnerModal'
import { findPartnerByName } from '@gepick/database/src/models/partner/functions'

@ObjectType()
class BookmakerExplorerIntervalReportStatisticItem {
  @Field(() => String)
  public intervalKey!: IntervalKeyType

  @Field(() => String)
  public betLabelName!: string

  @Field(() => Number)
  public betLabelId!: number

  @Field(() => String)
  public bet!: string

  @Field(() => Number)
  public allTimeRoi!: number
}

@ObjectType()
class bookmakerExplorerReportStatisticListResponse {
  @Field(() => [BookmakerExplorerIntervalReportStatisticItem])
  public items!: BookmakerExplorerIntervalReportStatisticItem[]
}

@ObjectType()
class IntervalPickScore {
  @Field(() => String, { nullable: true })
  public halftime?: string

  @Field(() => String, { nullable: true })
  public fulltime?: string
}

@ObjectType()
class IntervalPick {
  @Field(() => String)
  public countryFlag!: string

  @Field(() => String)
  public countryName!: string

  @Field(() => String)
  public leagueName!: string

  @Field(() => IntervalPickScore, { nullable: true })
  public score?: IntervalPickScore

  @Field(() => String)
  public homeTeamName!: string

  @Field(() => String)
  public awayTeamName!: string

  @Field(() => String)
  public matchStartTime!: string

  @Field(() => Boolean, { nullable: true })
  public isCorrect?: boolean

  @Field(() => Number, { nullable: true })
  public oddSize!: number
}

@ObjectType()
class LockedIntervalPick {
  @Field(() => String)
  public matchStartTime!: string

  @Field(() => String)
  public countryFlag!: string

  @Field(() => String)
  public countryName!: string

  @Field(() => String)
  public leagueName!: string
}

@ObjectType()
class IntervalPicksResponseStatistic {
  @Field(() => Number)
  public total!: number

  @Field(() => Number)
  public totalWithResult!: number

  @Field(() => Number)
  public totalCorrect!: number

  @Field(() => Number)
  public totalNotCorrect!: number

  @Field(() => Number)
  public correctPercent!: number

  @Field(() => Float, { nullable: true })
  public averageOdd!: number

  @Field(() => Number)
  public profit!: number

  @Field(() => Number)
  public roi!: number

  @Field(() => Number)
  public profitPerPick!: number
}

@ObjectType()
class IntervalPicksResponse {
  @Field(() => Boolean)
  public isPatron!: boolean

  @Field(() => Partner, { nullable: true })
  public partner?: Partner

  @Field(() => [IntervalPick], { nullable: true })
  public unlockedPicks?: IntervalPick[]

  @Field(() => [LockedIntervalPick], { nullable: true })
  public lockedPicks?: LockedIntervalPick[]

  @Field(() => IntervalPicksResponseStatistic, { nullable: true })
  public statistic?: IntervalPicksResponseStatistic
}

@InputType()
class IntervalPicksInput {
  @Field(() => String)
  public intervalKey!: IntervalKeyType

  @Field(() => Number)
  public betLabelId!: number

  @Field(() => String)
  public bet!: string

  @Field(() => String)
  public day!: string

  @Field(() => String, { nullable: true })
  public partnerName?: string
}

@Resolver()
class ValuePicksPageResolver {
  @Query(() => bookmakerExplorerReportStatisticListResponse)
  async bookmakerExplorerReportStatisticList() {
    const dbReportList = await findAllBookmakerExplorerReportStatistic()

    const formatedList = dbReportList.map((item) => {
      const betLabel = getBetLabelByLabelId(item.betLabelId)
      return {
        intervalKey: item.intervalKey,
        bet: item.bet,
        betLabelName: betLabel?.name,
        betLabelId: betLabel?.apiFootballLabelId,
        allTimeRoi: item.todayStatistic.allTimeRoi,
      }
    })

    const sortedList = reverse(sortBy(formatedList, 'allTimeRoi'))

    return { items: sortedList }
  }

  @Query(() => IntervalPicksResponse)
  async intervalPicks(@Ctx() ctx: IContext, @Arg('input') args: IntervalPicksInput) {
    const odds = await findMatchOdds({
      betLabelId: args.betLabelId,
      matchStartDay: args.day,
      apiFootballBookamkerId: 1,
    })

    const partner = args.partnerName ? await findPartnerByName(args.partnerName) : undefined

    const [intevalFrom, intervalTo] = args.intervalKey.split('-')

    const fromOdd = probabilityToOdd(parseInt(intervalTo, 10))
    const toOdd = probabilityToOdd(parseInt(intevalFrom, 10))

    const filteredOdds: {
      matchId: string
      oddSize: number
    }[] = []

    for (const odd of odds) {
      const betOdd = odd.oddsByBet.find((betOddItem) => {
        return betOddItem.bet === args.bet
      })

      if (betOdd?.oddSize) {
        if (betOdd.oddSize > fromOdd && betOdd.oddSize < toOdd) {
          filteredOdds.push({
            matchId: odd.matchId,
            oddSize: betOdd.oddSize,
          })
        }
      }
    }

    const matchIds = filteredOdds.map((item) => item.matchId)

    const matches = await findMatchesById(matchIds, { country: true })

    const isToday = moment().format('YYYY-MM-DD') === args.day

    const userIsPatron = ctx.user?.id ? await isPatron(ctx.user?.id) : false
    const isPartnerPicks = () => {
      if (!partner || !partner.valuePicksUnlockTillDate) {
        return false
      }

      return moment().isBefore(moment(partner.valuePicksUnlockTillDate))
    }

    const getUnlockedPicks = () => {
      return matches.map((match) => {
        const odd = filteredOdds.find((filteredOddsItem) => {
          return filteredOddsItem.matchId === match._id?.toString()
        })

        return {
          homeTeamName: match.homeTeamName,
          awayTeamName: match.awayTeamName,
          matchStartTime: moment(match.startTime).format('HH:mm'),
          countryFlag: match.country.flag,
          countryName: match.countryName,
          leagueName: match.leagueName,
          score: match.score,
          oddSize: odd?.oddSize,
        }
      })
    }

    const getLockedPicks = () => {
      return matches.map((match) => {
        return {
          matchStartTime: moment(match.startTime).format('HH:mm'),
          countryFlag: match.country.flag,
          countryName: match.countryName,
          leagueName: match.leagueName,
        }
      })
    }

    const getStats = () => {
      if (isToday) {
        return null
      }

      return calculateStatistic({
        matches,
        betLabelId: args.betLabelId,
        bet: args.bet,
        odds: filteredOdds,
      })
    }

    const isPicksUnlocked = userIsPatron || !isToday || isPartnerPicks()

    return {
      statistic: getStats(),
      isPatron: userIsPatron ?? false,
      partner,
      unlockedPicks: isPicksUnlocked ? getUnlockedPicks() : null,
      lockedPicks: !isPicksUnlocked ? getLockedPicks() : null,
    }
  }
}

export default ValuePicksPageResolver
