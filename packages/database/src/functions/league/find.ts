import { League } from '../../models/league/LeagueModel'
import LeagueModel from '../../models/league/LeagueModel'

export async function findLeagueByApiFootballLeagueId(apiFootballLeagueId: number) {
  const dbLeague = await LeagueModel.findOne({
    apiFootballLeagueId,
  })

  return dbLeague
}

export async function findAllLeagues(): Promise<Partial<League>[]> {
  const dbLeagues = await LeagueModel.find()

  return dbLeagues.map((dbLeague) => dbLeague.toObject())
}

interface IFindLeagueProps {
  countryName: string
  leagueName: string
}

export async function findLeague(props: IFindLeagueProps) {
  const dbLeague = await LeagueModel.findOne({ countryName: props.countryName, name: props.leagueName })

  return dbLeague
}

export async function findLeagueByDbId(leagueDbId: string) {
  const dbLeague = await LeagueModel.findOne({ _id: leagueDbId })

  return dbLeague
}
