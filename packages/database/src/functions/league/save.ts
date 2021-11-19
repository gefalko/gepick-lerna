import LeagueModel, { League, Season } from '../../models/league/LeagueModel'

export async function saveLeague(league: League) {
  try {
    const res = await new LeagueModel(league).save()

    return res
  } catch (err) {
    console.log('Failed save league', league)
    throw err
  }
}

export async function pushSeason(leagueDbId: string, season: Season) {
  const updatedLeague = await LeagueModel.findOneAndUpdate(
    {
      _id: leagueDbId,
    },
    {
      $push: { seasons: season },
    },
  )

  return updatedLeague
}
