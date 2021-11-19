import { Resolver, Query, ObjectType, Field, Arg, InputType } from 'type-graphql'
import { findBookmakerExplorer_intervalReports } from '@gepick/database/src/models/bookmakerExplorer_intervalReport/functions'
import { ReportPeriodEnum } from '@gepick/utils/src/enums'
import { BookmakerExplorer_intervalReport } from '@gepick/database/src/models/bookmakerExplorer_intervalReport/BookmakerExplorer_intervalReport'
import { IntervalKeyType } from '@gepick/utils/src/BookmakerExplorerInterval'

@ObjectType()
class BookmakerPerformanceReport {
  @Field(() => [BookmakerExplorer_intervalReport])
  public items!: BookmakerExplorer_intervalReport[]
}

@InputType()
class BookmakerExplorerReportQueryInput {
  @Field(() => Number)
  public betLabelId!: number

  @Field(() => Number)
  public year!: number

  @Field(() => Number, { nullable: true })
  public yearMonth?: number

  @Field(() => Number, { nullable: true })
  public yearWeek?: number

  @Field(() => Number, { nullable: true })
  public monthDay?: number

  @Field(() => ReportPeriodEnum)
  public periodType!: ReportPeriodEnum
}

@InputType()
class BookmakerExplorerIntervalReportQueryInput {
  @Field(() => String)
  public intervalKey!: IntervalKeyType

  @Field(() => Number)
  public betLabelId!: number

  @Field(() => ReportPeriodEnum)
  public periodType!: ReportPeriodEnum

  @Field(() => String)
  public bet!: string
}

@Resolver()
class BookmakerExplorerPageResolver {
  @Query(() => BookmakerPerformanceReport)
  async bookmakerExplorerReport(@Arg('args') args: BookmakerExplorerReportQueryInput) {
    const dbReportList = await findBookmakerExplorer_intervalReports({
      betLabelId: args.betLabelId,
      periodType: args.periodType,
      year: args.year,
      yearMonth: args.yearMonth,
      yearWeek: args.yearWeek,
      monthDay: args.monthDay,
    })

    return { items: dbReportList }
  }

  @Query(() => BookmakerPerformanceReport)
  async bookmakerExplorerIntervalReport(@Arg('args') args: BookmakerExplorerIntervalReportQueryInput) {
    const dbReportList = await findBookmakerExplorer_intervalReports({
      betLabelId: args.betLabelId,
      intervalKey: args.intervalKey,
      periodType: args.periodType,
      bet: args.bet,
    })

    return { items: dbReportList }
  }
}

export default BookmakerExplorerPageResolver
