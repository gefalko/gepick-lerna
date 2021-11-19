import { Ctx, Resolver, Query, InputType, Field, Arg, Mutation, ObjectType } from 'type-graphql'
import {
  PredictionBot,
  findAllPredictionBots,
  createPredictionBot,
  findPredictionBotByDockerImage,
  findAccountById,
} from '@gepick/database'
import { dockerPull, dockerStart } from '@gepick/utils/src/Docker'
import { askFreePort } from '@gepick/database/src/functions/system/askFreePort'
import { BotBetReportByPeriod } from '@gepick/database/src/models/botBetReportByPeriod/botBetReportByPeriodModel'
import { findBotBetReportsByPeriodAndBet } from '@gepick/database/src/models/botBetReportByPeriod/functions'
import { ReportPeriodEnum } from '@gepick/utils/src/enums'
import { BetTypeEnum } from '@gepick/utils'
import { enumerateDaysBetweenDates, toDbDate, isSameDays } from '@gepick/utils/src/dates'
import { IContext } from '../utils/utils'

@InputType()
class BotReportsOfAllBetsByDayQueryInput {
  @Field()
  public botId!: string

  @Field()
  public dateFrom!: string

  @Field()
  public dateTo!: string
}

@InputType()
class UploadBotMutationInput {
  @Field()
  public dockerImage!: string

  @Field({ nullable: true })
  public gitRepository: string

  @Field({ nullable: true })
  public description: string
}

@ObjectType()
class BotBetDayReports {
  @Field()
  day: string

  @Field(() => BotBetReportByPeriod, { nullable: true })
  home?: BotBetReportByPeriod

  @Field(() => BotBetReportByPeriod, { nullable: true })
  draw?: BotBetReportByPeriod

  @Field(() => BotBetReportByPeriod, { nullable: true })
  away?: BotBetReportByPeriod

  @Field(() => BotBetReportByPeriod, { nullable: true })
  under?: BotBetReportByPeriod

  @Field(() => BotBetReportByPeriod, { nullable: true })
  over?: BotBetReportByPeriod
}

@ObjectType()
class UploadBotResponse {
  @Field()
  dockerImage: string

  @Field()
  botId: string
}

@Resolver()
class BotResolver {
  @Query(() => [PredictionBot])
  async bots() {
    const bots = await findAllPredictionBots()

    return bots
  }

  @Query(() => [BotBetDayReports])
  async botReportsOfAllBetsByDay(@Arg('props') props: BotReportsOfAllBetsByDayQueryInput) {
    const getProps = (bet: BetTypeEnum) => {
      return {
        botDbId: props.botId,
        dateFrom: toDbDate(props.dateFrom).toDate(),
        dateTo: toDbDate(props.dateTo).toDate(),
        bet,
        reportPeriod: ReportPeriodEnum.DAY,
      }
    }

    const homeAllReports = await findBotBetReportsByPeriodAndBet(getProps(BetTypeEnum.HOME))
    const drawAllReports = await findBotBetReportsByPeriodAndBet(getProps(BetTypeEnum.DRAW))
    const awayAllReports = await findBotBetReportsByPeriodAndBet(getProps(BetTypeEnum.AWAY))
    const underAllReports = await findBotBetReportsByPeriodAndBet(getProps(BetTypeEnum.UNDER))
    const overAllReports = await findBotBetReportsByPeriodAndBet(getProps(BetTypeEnum.OVER))

    const daysList = enumerateDaysBetweenDates(props.dateFrom, props.dateTo)

    const reportsByDayList = daysList.map((day) => {
      const findReport = (report: BotBetReportByPeriod) => {
        return isSameDays(day, report.dateFrom)
      }

      return {
        day,
        home: homeAllReports.find(findReport),
        draw: drawAllReports.find(findReport),
        away: awayAllReports.find(findReport),
        under: underAllReports.find(findReport),
        over: overAllReports.find(findReport),
      }
    })

    return reportsByDayList
  }

  @Mutation(() => UploadBotResponse)
  async uploadBot(@Ctx() ctx: IContext, @Arg('props') props: UploadBotMutationInput) {
    if (!ctx.user?.id) {
      throw new Error('Authorization failed')
    }

    const dbBot = await findPredictionBotByDockerImage(props.dockerImage)

    if (dbBot) {
      throw new Error(`Bot already exist`)
    }

    const freePort = await askFreePort()

    await dockerPull(props.dockerImage)
    await dockerStart(props.dockerImage, freePort)

    const creator = await findAccountById(ctx.user.id)

    if (creator) {
      const newBot = await createPredictionBot({
        dockerImage: props.dockerImage,
        active: true,
        description: props.description,
        creator,
        portNumber: freePort,
      })

      if (newBot) {
        return {
          dockerImage: newBot.dockerImage,
          botId: newBot._id,
        }
      }
    }

    throw new Error('System error.')
  }
}

export default BotResolver
