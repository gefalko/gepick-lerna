import { ITeamBase } from '../../types'
import TeamModel from '../../models/team/TeamModel'

export async function saveTeam(team: ITeamBase) {
  const dbTeam = await new TeamModel(team).save()

  return dbTeam
}
