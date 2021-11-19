import { sortBy } from 'lodash'
import { MatchPredictions } from '@gepick/database/src/models/matchPredictions/MatchPredictionsModel'
import { PredictionBot } from '@gepick/database/src/models/predictionBot/PredictionBotModel'
import { MatchOdds } from '@gepick/database/src/models/matchOdds/MatchOddsModel'
import { MatchStatusEnum } from '@gepick/database/src/types'
import { setPickStatus, setPickProfit } from './pickStatus'
import { isValue } from './utils'
import { BetLabels } from './BetLabels'
import { getBookmakerName } from './bookmakers'

function getOddsByBet(odds: MatchOdds[], betLabelId: number, betValue: string) {
  const betOdds = []

  for (const odd of odds) {
    if (odd.betLabelId === betLabelId) {
      for (const oddByBet of odd.oddsByBet) {
        if (oddByBet.bet === betValue) {
          betOdds.push({
            updateAt: 1,
            bookmakerId: odd.apiFootballBookamkerId,
            bookamkerName: getBookmakerName(odd.apiFootballBookamkerId),
            oddSize: oddByBet.oddSize,
          })
        }
      }
    }
  }

  return betOdds
}

function getSecondBestOddByBet(odds: MatchOdds[], labelId: number, bet: string) {
  const oddsByBet = getOddsByBet(odds, labelId, bet)

  if (odds.length === 0) {
    return null
  }

  const sortedOdds = sortBy(oddsByBet, 'oddSize')

  if (!sortedOdds[1]) {
    return null
  }

  const odd = sortedOdds[1]

  return odd
}

function getPrediction(matchPredictions: MatchPredictions[], betLabelId: number, bet: string) {
  const predictionsByLabel = matchPredictions.find((predictions) => {
    return predictions.betLabelId === betLabelId
  })

  if (!predictionsByLabel) {
    return null
  }

  const predictionsByBet = predictionsByLabel.predictionsByBet.find((predictionByBet) => {
    return predictionByBet.bet === bet
  })

  return predictionsByBet
}

interface IToPickPropsMatch {
  _id?: string
  status: MatchStatusEnum
  startTime: Date
  goalsHomeTeam?: number | null
  goalsAwayTeam?: number | null
}

interface IToPickProps {
  match: IToPickPropsMatch
  matchPredictions: MatchPredictions[]
  matchOdds: MatchOdds[]
  bet: string
  betLabelId: number
  bot: PredictionBot | null
}

export function toPick(props: IToPickProps) {
  const status = setPickStatus(props.match, props.betLabelId, props.bet)
  const bestOdd = getSecondBestOddByBet(props.matchOdds, props.betLabelId, props.bet)

  if (!bestOdd) {
    return null
  }

  const prediction = getPrediction(props.matchPredictions, props.betLabelId, props.bet)

  if (!prediction) {
    return null
  }

  const profit = setPickProfit(bestOdd.oddSize, status)

  return {
    match: props.match,
    oddSize: bestOdd.oddSize,
    createTime: new Date(),
    startTime: props.match.startTime,
    probability: prediction.probability,
    betLabelId: props.betLabelId,
    bet: props.bet,
    bookmakerId: bestOdd.bookmakerId,
    botDockerImage: props.bot?.dockerImage,
    status,
    profit,
  }
}

export function toValuePick(props: IToPickProps) {
  const pick = toPick(props)

  if (!pick) {
    return null
  }

  if (pick.probability > 70 && isValue(pick.oddSize, pick.probability)) {
    return pick
  }

  return null
}

interface IFilterValuePicksProps {
  match: IToPickPropsMatch
  matchPredictions: MatchPredictions[]
  matchOdds: MatchOdds[]
  bot: PredictionBot | null
}

export function filterValuePicks(props: IFilterValuePicksProps) {
  const getProps = (betLabelId: number, bet: string) => {
    return {
      match: props.match,
      matchPredictions: props.matchPredictions,
      matchOdds: props.matchOdds,
      betLabelId,
      bet,
      bot: props.bot,
    }
  }

  const homePick = toValuePick(getProps(BetLabels.MatchWinner.apiFootballLabelId, BetLabels.MatchWinner.values.Home))
  const drawPick = toValuePick(getProps(BetLabels.MatchWinner.apiFootballLabelId, BetLabels.MatchWinner.values.Draw))
  const awayPick = toValuePick(getProps(BetLabels.MatchWinner.apiFootballLabelId, BetLabels.MatchWinner.values.Away))

  const underPicks = [
    toValuePick(getProps(BetLabels.GoalsOverUnder.apiFootballLabelId, BetLabels.GoalsOverUnder.values.Under0_5)),
    toValuePick(getProps(BetLabels.GoalsOverUnder.apiFootballLabelId, BetLabels.GoalsOverUnder.values.Under1_5)),
    toValuePick(getProps(BetLabels.GoalsOverUnder.apiFootballLabelId, BetLabels.GoalsOverUnder.values.Under2_5)),
    toValuePick(getProps(BetLabels.GoalsOverUnder.apiFootballLabelId, BetLabels.GoalsOverUnder.values.Under3_5)),
    toValuePick(getProps(BetLabels.GoalsOverUnder.apiFootballLabelId, BetLabels.GoalsOverUnder.values.Under4_5)),
    toValuePick(getProps(BetLabels.GoalsOverUnder.apiFootballLabelId, BetLabels.GoalsOverUnder.values.Under5_5)),
    toValuePick(getProps(BetLabels.GoalsOverUnder.apiFootballLabelId, BetLabels.GoalsOverUnder.values.Under6_5)),
  ]

  const overPicks = [
    toValuePick(getProps(BetLabels.GoalsOverUnder.apiFootballLabelId, BetLabels.GoalsOverUnder.values.Over0_5)),
    toValuePick(getProps(BetLabels.GoalsOverUnder.apiFootballLabelId, BetLabels.GoalsOverUnder.values.Over1_5)),
    toValuePick(getProps(BetLabels.GoalsOverUnder.apiFootballLabelId, BetLabels.GoalsOverUnder.values.Over2_5)),
    toValuePick(getProps(BetLabels.GoalsOverUnder.apiFootballLabelId, BetLabels.GoalsOverUnder.values.Over3_5)),
    toValuePick(getProps(BetLabels.GoalsOverUnder.apiFootballLabelId, BetLabels.GoalsOverUnder.values.Over4_5)),
    toValuePick(getProps(BetLabels.GoalsOverUnder.apiFootballLabelId, BetLabels.GoalsOverUnder.values.Over5_5)),
    toValuePick(getProps(BetLabels.GoalsOverUnder.apiFootballLabelId, BetLabels.GoalsOverUnder.values.Over6_5)),
  ]

  const picks = {
    home: homePick,
    draw: drawPick,
    away: awayPick,
    under: underPicks.filter((pick) => pick != null),
    over: overPicks.filter((pick) => pick != null),
  }

  return picks
}
