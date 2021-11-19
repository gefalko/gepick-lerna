import { Resolver, Query, Arg, Field, ObjectType, InputType } from 'type-graphql'
import { Country } from '@gepick/database/src/models/country/CountryModel'
import cache from './cache/cache'
import getPredictionPageMatchesV2, { PredictionsPageMatchV2 } from './cache/getPredictionPageMatchesV2'

@ObjectType()
export class ValueBotBetVsOdd {
  @Field()
  botDockerImage: string

  @Field(() => Number)
  probability: number
}

@InputType()
class PredictionsPageMatchesQueryInput {
  @Field(() => String)
  public day!: string

  @Field(() => Number)
  public offset!: number

  @Field(() => Number)
  public limit!: number

  @Field(() => [String], { nullable: true })
  public coutriesIds?: string[]
}

@Resolver()
class PredictionsPageResolver {
  @Query(() => [PredictionsPageMatchV2])
  async predictionsPageMatchesV2(@Arg('args') args: PredictionsPageMatchesQueryInput) {
    const matchesFromCache = cache.getPredictionsPageMatches(args.day)

    const filterByArgs = (matches: PredictionsPageMatchV2[]) => {
      if (!args.coutriesIds) {
        return matches
      }

      const filteredMatches = matches.filter((match) => {
        if (args.coutriesIds && args.coutriesIds.length > 0) {
          return args.coutriesIds.includes(match.countryId.toString())
        }

        return true
      })

      return filteredMatches
    }

    if (matchesFromCache) {
      const filtered = filterByArgs(matchesFromCache)
      return filtered.slice(args.offset, args.offset + args.limit)
    }

    const matches = await getPredictionPageMatchesV2({
      day: args.day,
    })

    cache.setPredictionsPageMatches({
      day: args.day,
      matches,
    })

    const filtered = filterByArgs(matches)

    return filtered.slice(args.offset, args.offset + args.limit)
  }

  @Query(() => [Country])
  countriesList() {
    return cache.getCountries()
  }
}

export default PredictionsPageResolver
