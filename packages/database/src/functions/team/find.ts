import TeamModel from '../../models/team/TeamModel'

export async function findTeamByApiFootballTeamId(teamId: number) {
  const dbTeam = await TeamModel.findOne({
    apiFootballTeamId: teamId,
  })

  return dbTeam
}

export async function apiFootbalTeamExistByTeamId(teamId: number) {
  const dbTeam = await TeamModel.findOne({
    apiFootbalTeamId: teamId,
  })

  return dbTeam !== null
}
