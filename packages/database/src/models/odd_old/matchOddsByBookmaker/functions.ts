import MatchOddByBookmakerModel, { MatchOddByBookmaker } from './MatchOddByBookmakerModel'

interface IFindMatchOddsByBookmakerProps {
  matchId: string
  apiFootballBookamkerId: number
}

export async function findMatchOddsByBookmaker(props: IFindMatchOddsByBookmakerProps) {
  const oddsByBookmaker = await MatchOddByBookmakerModel.findOne({
    matchId: props.matchId,
    apiFootballBookamkerId: props.apiFootballBookamkerId,
  })

  return oddsByBookmaker
}

export async function createMatchOddsByBookmaker(oddsByBookmaker: MatchOddByBookmaker) {
  const dbOddsByBookamker = await new MatchOddByBookmakerModel(oddsByBookmaker).save()

  return dbOddsByBookamker
}

export async function saveMatchBookamkerOdds(odds: MatchBookmakerOdds) {
  const dbMatchBookmakerOdds = await new MatchBookmakerOddsModel(odds).save()

  console.log('Pres Saved odd', JSON.stringify(odds, null, 2))
  console.log('Saved odd', JSON.stringify(dbMatchBookmakerOdds.toObject(), null, 2))

  return dbMatchBookmakerOdds
}

export async function findMatchBookmakerOddsById(matchBookmakerOddsId: string) {
  const matchBookmakerOdds = await MatchBookmakerOddsModel.findOne({
    _id: matchBookmakerOddsId,
  })

  return matchBookmakerOdds
}

interface IFindBetOddSizeProps {
  matchBookmakerOdds: MatchBookmakerOdds
  betLabelId: number
  bet: string
}

export function findBetOddSize(props: IFindBetOddSizeProps) {
  for (const bet of props.matchBookmakerOdds.bets) {
    if (bet.labelId === props.betLabelId) {
      for (const oddBetValue of bet.value) {
        if (props.bet === oddBetValue.value) {
          return oddBetValue.odd
        }
      }
    }
  }

  return undefined
}
