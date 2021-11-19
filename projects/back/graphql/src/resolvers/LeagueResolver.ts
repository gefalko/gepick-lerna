import { Resolver, Query, Arg } from 'type-graphql'
import { League, findAllLeagues, findLeagueByDbId } from '@gepick/database'

@Resolver()
class LeagueResolver {
  @Query(() => [League])
  async leagues() {
    const leagues = await findAllLeagues()
    return leagues
  }

  @Query(() => League)
  async leagueById(@Arg('leagueId') leagueDbId: string) {
    const league = await findLeagueByDbId(leagueDbId)
    return league
  }
}

export default LeagueResolver
