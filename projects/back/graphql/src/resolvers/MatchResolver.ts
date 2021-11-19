import { Resolver, Query, Arg, FieldResolver, ObjectType, Root, Field, InputType } from 'type-graphql'
import * as NodeCache from 'node-cache'
import { printlog } from '@gepick/utils'
import { groupBy, map } from 'lodash'
import {
  Match,
  findMatches,
  findMatchesById,
  findMatchesByDay,
  getHistoricalMatches,
  IGetHistoricalMatches_Match,
  findMatch,
} from '@gepick/database'
import LeagueMatches from '../LeagueMatches'

const cache = new NodeCache()

@ObjectType()
class MatchHistoricalMatches {
  @Field(() => [Match])
  home: Match[]

  @Field(() => [Match])
  away: Match[]
}

@InputType()
class MatchesQueryInput {
  @Field(() => Number)
  public seasionApiFootballLeagueId!: number

  @Field(() => Number, { nullable: true })
  public year?: number

  @Field({ nullable: true })
  public fromDatetime?: string

  @Field({ nullable: true })
  public toDatetime?: string
}

@InputType()
class MatchesByDayGroupedByLeagueQueriesInput {
  @Field()
  public day!: string

  @Field(() => Number, { nullable: true })
  public from?: number

  @Field(() => Number, { nullable: true })
  public to?: number
}

@InputType()
class MatchesByDayQueryInput {
  @Field()
  public day!: string

  @Field(() => Number, { nullable: true })
  public offset?: number

  @Field(() => Number, { nullable: true })
  public limit?: number
}

@Resolver(() => Match)
class MatchResolver {
  @Query(() => [Match])
  async matches(@Arg('args') props: MatchesQueryInput) {
    const matches = await findMatches({ search: { seasionApiFootballLeagueId: props.seasionApiFootballLeagueId } })
    return matches
  }

  @Query(() => [Match])
  async matchesByIds(
    @Arg('ids', () => [String]) ids: string[],
    @Arg('historicalDeep', () => Number) historicalDeep?: number,
  ) {
    printlog(historicalDeep)
    const matches = await findMatchesById(ids, { homeTeam: true, awayTeam: true })

    return matches
  }

  @Query(() => [Match])
  async matchesByDay(@Arg('props') props: MatchesByDayQueryInput) {
    const matches = await findMatchesByDay({
      day: props.day,
      populateOptions: {},
      offset: props.offset,
      limit: props.limit,
    })

    return matches
  }

  @Query(() => [LeagueMatches])
  async matchesByDayGroupedByLeague(@Arg('props') props: MatchesByDayGroupedByLeagueQueriesInput) {
    const cacheKey = 'matchesByDayGroupedByLeague_' + props.day
    const createCachedFormatedGroups = async () => {
      const matches = await findMatchesByDay({ day: props.day, populateOptions: { league: true, country: true } })
      const groupedMatches = groupBy(matches, 'league._id')

      const formatedGroups = map(groupedMatches, (leagueMatchesList) => {
        const [firstMatch] = leagueMatchesList

        return {
          leagueName: firstMatch.leagueName,
          countryName: firstMatch.countryName,
          leagueFlag: firstMatch.league.flag,
          leagueLogo: firstMatch.league.logo,
          countryFlag: firstMatch.country.flag,
          matches: leagueMatchesList,
        }
      })

      cache.set(cacheKey, formatedGroups, 3600)

      return formatedGroups
    }

    const cachedFormatedGroups = cache.get(cacheKey) ?? (await createCachedFormatedGroups())

    if (props.from != null && props.to != null) {
      return (cachedFormatedGroups as LeagueMatches[]).slice(props.from, props.to)
    }

    return cachedFormatedGroups
  }

  @Query(() => Match)
  async match(@Arg('matchId') matchId: string, @Arg('historicalDeep') historicalDeep?: number) {
    const match = await findMatch({ matchId, historicalDeep }, { homeTeam: true, awayTeam: true, league: true })

    return match?.toObject()
  }

  @FieldResolver(() => MatchHistoricalMatches)
  async historicalMatches(@Root() match: Match) {
    const getMatch = (): IGetHistoricalMatches_Match => {
      if ((match as any)._doc) {
        return (match as any)._doc
      }

      return match
    }

    return getHistoricalMatches(getMatch())
  }
}

export default MatchResolver
