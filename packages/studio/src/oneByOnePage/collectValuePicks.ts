import { IPredictionBotMatchPredictions } from '@gepick/utils/src/predict'
import { flatten } from 'lodash'
import { BetLabels, BetType } from '@gepick/utils/src/BetLabels'
import { oddToProbability } from '@gepick/utils/src/utils'
import { setPickStatus, setPickProfit } from '@gepick/utils/src/pickStatus'
import { IPick } from '@gepick/components/pick/Pick'
import { MatchOdds } from '@gepick/database/src/models/matchOdds/MatchOddsModel'
import { IMatch } from '../types'
import getPredictionProbability from './getPredictionProbability'

interface IGetBestOddProps {
  matchOdds: MatchOdds[]
  bet: BetType
}

function getBestOdd(props: IGetBestOddProps) {
  let bestOdd = {
    oddSize: 0,
    bookmakerId: 0,
    probability: 0,
  }

  for (const oddsByLabel of props.matchOdds) {
    for (const oddByBet of oddsByLabel.oddsByBet) {
      if (oddByBet.bet === props.bet && oddByBet.oddSize > bestOdd.oddSize) {
        bestOdd = {
          oddSize: oddByBet.oddSize,
          probability: oddToProbability(oddByBet.oddSize),
          bookmakerId: oddsByLabel.apiFootballBookamkerId,
        }
      }
    }
  }

  return bestOdd.oddSize ? bestOdd : null
}

interface ICollectMatchValuePicksByBetProps {
  match: IMatch
  matchOdds: MatchOdds[]
  bet: BetType
  apiFootballLabelId: number
  matchPredictions: IPredictionBotMatchPredictions
}

function collectMatchValuePicksByBet(props: ICollectMatchValuePicksByBetProps) {
  const probability = getPredictionProbability(props.matchPredictions, props.bet)

  const bestOdd = getBestOdd({ matchOdds: props.matchOdds, bet: props.bet })

  if (!bestOdd || !probability) {
    return null
  }

  if (probability > bestOdd.probability) {
    const status = setPickStatus(props.match, props.apiFootballLabelId, props.bet)

    const { oddSize } = bestOdd

    const pick = {
      status,
      match: props.match,
      probability,
      bet: props.bet,
      oddSize,
      bookmakerId: bestOdd.bookmakerId,
      botDockerImage: '-',
      profit: setPickProfit(oddSize, status),
    } as IPick

    return pick
  }

  return undefined
}

interface ICollectMatchValuePicksProps {
  match: IMatch
  matchOdds: MatchOdds[]
  matchPredictions: IPredictionBotMatchPredictions
}

function collectMatchValuePicks(props: ICollectMatchValuePicksProps): IPick[] {
  const collectMatchWinnerValuePicks = (bet: BetType) => {
    return collectMatchValuePicksByBet({
      apiFootballLabelId: BetLabels.MatchWinner.apiFootballLabelId,
      matchPredictions: props.matchPredictions,
      matchOdds: props.matchOdds,
      match: props.match,
      bet,
    })
  }

  const collectUOValuePicks = (bet: BetType) => {
    return collectMatchValuePicksByBet({
      apiFootballLabelId: BetLabels.GoalsOverUnder.apiFootballLabelId,
      matchPredictions: props.matchPredictions,
      matchOdds: props.matchOdds,
      match: props.match,
      bet,
    })
  }

  const matchValuePicks = [
    collectMatchWinnerValuePicks('Home'),
    collectMatchWinnerValuePicks('Draw'),
    collectMatchWinnerValuePicks('Away'),
    collectUOValuePicks('Under 0.5'),
    collectUOValuePicks('Over 0.5'),
    collectUOValuePicks('Under 1.5'),
    collectUOValuePicks('Over 1.5'),
    collectUOValuePicks('Under 2.5'),
    collectUOValuePicks('Over 2.5'),
    collectUOValuePicks('Under 3.5'),
    collectUOValuePicks('Over 3.5'),
    collectUOValuePicks('Under 4.5'),
    collectUOValuePicks('Over 4.5'),
    collectUOValuePicks('Under 5.5'),
    collectUOValuePicks('Over 5.5'),
    collectUOValuePicks('Under 6.5'),
    collectUOValuePicks('Over 6.5'),
  ]

  return matchValuePicks.filter((p): p is IPick => p !== undefined && p !== null)
}

interface ICollectValuePicksProps {
  matches: IMatch[]
  matchOdds: MatchOdds[]
  matchesPredictions: IPredictionBotMatchPredictions[]
}

function collectValuePicks(props: ICollectValuePicksProps) {
  const valuePicks = []
  for (const match of props.matches) {
    const matchPredictions = props.matchesPredictions.find((predictions) => predictions?.matchId === match._id)
    const matchOdds = props.matchOdds.filter((odds) => match._id === odds.matchId)

    if (matchPredictions) {
      const matchValuePicks = collectMatchValuePicks({
        match,
        matchOdds,
        matchPredictions,
      })

      valuePicks.push(matchValuePicks)
    }
  }

  return flatten(valuePicks)
}

export default collectValuePicks
