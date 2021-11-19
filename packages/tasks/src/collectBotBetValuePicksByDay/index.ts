import { flatten } from 'lodash'
import { PickStatusEnum } from '@gepick/database/src/types'
import {
  findMatchesByDay,
  findAllPredictionBots,
  Match,
  createPicks,
  findMatchPredictions,
  PredictionBot,
} from '@gepick/database'
import { filterValuePicks } from '@gepick/utils'
import {
  removeBotBetValuePicksByDay,
  saveBotBetValuePicksByDay,
} from '@gepick/database/src/models/botBetValuePicksByDay/functions'
import { findMatchOdds } from '@gepick/database/src/models/matchOdds/functions'

interface IBotValuePicksPick {
  match: Match
  oddSize: number
  createTime: Date
  startTime: Date
  probability: number
  betLabelId: number
  bookmakerId: number
  bet: string
  botDockerImage: string
  status: PickStatusEnum
  profit?: number
}

interface IBotBetsValuePicks {
  home: IBotValuePicksPick | null
  draw: IBotValuePicksPick | null
  away: IBotValuePicksPick | null
  under: (IBotValuePicksPick | null)[]
  over: (IBotValuePicksPick | null)[]
}

interface IProcessBotPicksByBetProps {
  botBetsValuePicks: IBotBetsValuePicks[]
  bet: keyof IBotBetsValuePicks
  day: Date
  botDockerImage: string
  botDbId: string
}

const filterPicksByBet = (botBetsValuePicks: IBotBetsValuePicks[], bet: keyof IBotBetsValuePicks) => {
  const betPicks = flatten(botBetsValuePicks.map((picks: IBotBetsValuePicks) => picks[bet]))
  const filteredPicks = betPicks.filter((pick) => pick != null)

  return filteredPicks
}

async function processBotPicksByBet(props: IProcessBotPicksByBetProps) {
  const picksByBet = filterPicksByBet(props.botBetsValuePicks, props.bet)
  const dbPicks = await createPicks(picksByBet)

  await removeBotBetValuePicksByDay({
    day: props.day,
    botDbId: props.botDbId,
    bet: props.bet,
  })
  await saveBotBetValuePicksByDay({
    day: props.day,
    botDockerImage: props.botDockerImage,
    botDbId: props.botDbId,
    picks: dbPicks,
    bet: props.bet,
  })
}

/*
function getMatchBotPredictions(props: IGetBotPredictionsProps) {
  const matchPredictionsByBot = props.matchPredictions.find((predictions) => {
    if (predictions.predictionBotRepository === props.botRepository) {
      return true
    }

    return false
  })

  return matchPredictionsByBot
}
*/

async function collectValuePickByMatchAndBot(bot: PredictionBot, match: Match) {
  const matchPredictions = await findMatchPredictions({
    search: { matchId: match._id, botDockerImage: bot.dockerImage },
  })

  const matchOdds = await findMatchOdds({ matchId: match._id })

  if (!matchPredictions || !matchOdds) {
    return null
  }

  const valuePicks = filterValuePicks({
    match,
    matchOdds,
    bot,
    matchPredictions,
  })

  const toBotValuePicks = (valuePicksByBet: typeof valuePicks['home']) => {
    if (valuePicksByBet) {
      return {
        match,
        oddSize: valuePicksByBet.oddSize,
        createTime: valuePicksByBet.createTime,
        startTime: valuePicksByBet.startTime,
        probability: valuePicksByBet.probability,
        betLabelId: valuePicksByBet.betLabelId,
        bet: valuePicksByBet.bet,
        botDockerImage: bot.dockerImage,
        status: valuePicksByBet.status,
        profit: valuePicksByBet.profit,
        bookmakerId: valuePicksByBet.bookmakerId,
      }
    }

    return null
  }

  return {
    home: toBotValuePicks(valuePicks.home),
    draw: toBotValuePicks(valuePicks.draw),
    away: toBotValuePicks(valuePicks.away),
    under: valuePicks.under.map(toBotValuePicks),
    over: valuePicks.over.map(toBotValuePicks),
  }
}

export async function collectBotBetValuePicksByDayTask(dayString: string) {
  const dayMatches = await findMatchesByDay({ day: dayString })
  const bots = await findAllPredictionBots()

  for (const bot of bots) {
    const botBetsValuePicks: IBotBetsValuePicks[] = []

    for (const match of dayMatches) {
      const valuePicksOfMatch = await collectValuePickByMatchAndBot(bot, match)

      if (valuePicksOfMatch) {
        botBetsValuePicks.push(valuePicksOfMatch)
      }
    }

    const getProps = (bet: keyof IBotBetsValuePicks): IProcessBotPicksByBetProps => {
      return {
        botBetsValuePicks,
        bet,
        day: new Date(dayString),
        botDockerImage: bot.dockerImage,
        botDbId: bot._id,
      }
    }

    await processBotPicksByBet(getProps('home'))
    await processBotPicksByBet(getProps('draw'))
    await processBotPicksByBet(getProps('away'))
    await processBotPicksByBet(getProps('under'))
    await processBotPicksByBet(getProps('over'))
  }
}
