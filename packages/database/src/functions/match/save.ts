import MatchModel, { Match } from '../../models/match/MatchModel'

export async function saveMatch(match: Match) {
  const dbMatch = await new MatchModel(match).save()

  return dbMatch
}
