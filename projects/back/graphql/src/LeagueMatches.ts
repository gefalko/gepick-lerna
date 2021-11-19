import { ObjectType, Field } from 'type-graphql'
import { Match } from '@gepick/database/src/models/match/MatchModel'

@ObjectType()
export class LeagueMatches {
  @Field()
  public leagueName!: string

  @Field({ nullable: true })
  public leagueFlag?: string

  @Field()
  public leagueLogo!: string

  @Field()
  public countryName!: string

  @Field({ nullable: true })
  public countryFlag?: string

  @Field(() => [Match])
  public matches!: Match[]
}

export default LeagueMatches
