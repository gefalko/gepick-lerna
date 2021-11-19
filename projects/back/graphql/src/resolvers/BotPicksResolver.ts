import { Resolver, Query, Field, Arg, InputType } from 'type-graphql'
import * as NodeCache from 'node-cache'
import { BotBetValuePicksByDay } from '@gepick/database/src/models/botBetValuePicksByDay/BotBetValuePicksByDayModel'
import {
  findBotBetValuePicksByDay,
  findAllBotBetValuePicksByDay,
} from '@gepick/database/src/models/botBetValuePicksByDay/functions'

const cache = new NodeCache()

@InputType()
class BotPicksQueryInput {
  @Field()
  public day!: string

  @Field()
  public botDbId!: string

  @Field()
  public bet!: string
}

@InputType()
class BotBetValuePikcsByDayQueryInput {
  @Field()
  public day!: string
}

@Resolver()
class BotPicksResolver {
  @Query(() => BotBetValuePicksByDay)
  async botPicks(@Arg('props') props: BotPicksQueryInput) {
    const botPicks = await findBotBetValuePicksByDay(
      {
        day: new Date(props.day),
        botDbId: props.botDbId,
        bet: props.bet,
      },
      true,
      true,
    )

    return botPicks
  }

  @Query(() => [BotBetValuePicksByDay])
  async botBetValuePicksByDay(@Arg('props') props: BotBetValuePikcsByDayQueryInput) {
    const cacheKey = 'botBetValuePikcsByDay_' + props.day

    const createCachedValuePicks = async () => {
      const botPicks = await findAllBotBetValuePicksByDay(
        {
          day: new Date(props.day),
        },
        true,
        true,
      )

      cache.set(cacheKey, botPicks, 3600)

      return botPicks
    }

    const cachedValuePicksByDay = cache.get(cacheKey) ?? (await createCachedValuePicks())

    return cachedValuePicksByDay
  }
}

export default BotPicksResolver
