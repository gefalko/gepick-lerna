interface IFixturesFromOneDayResponseTeam {
  team_id: number
  team_name: string
  logo: string
}

export interface IFixture {
  fixture_id: number
  league_id: number
  league: {
    name: string
    country: string
    logo: string | null
    flag: string | null
  }
  event_date: string
  event_timestamp: number
  firstHalfStart: number | null
  secondHalfStart: number | null
  round: string
  status: string
  statusShort: string
  elapsed: number
  venue: string | null
  referee: string | null
  homeTeam: IFixturesFromOneDayResponseTeam
  awayTeam: IFixturesFromOneDayResponseTeam
  goalsHomeTeam: number | null
  goalsAwayTeam: number | null
  score: {
    halftime: string
    fulltime: string
    extratime: string
    penalty: string
  } | null
}

export interface IFixturesFromOneDayResponse_Fixture extends IFixture {}

export interface IFixturesFromOneDayResponse {
  api: {
    results: number
    fixtures: IFixturesFromOneDayResponse_Fixture[]
  }
}

export interface ILeague {
  league_id: number
  name: string
  type: string
  country: string
  country_code: string | null
  season: number
  season_start: string
  season_end: string
  logo: string | null
  flag: string
  standings: number
  is_current: number
  coverage: {
    standings: boolean
    fixtures: {
      events: boolean
      lineups: boolean
      statistics: boolean
      players_statistics: boolean
    }
    players: boolean
    topScorers: boolean
    predictions: boolean
    odds: boolean
  }
}

export interface ILeaguesByIdResponse {
  api: {
    results: number
    leagues: ILeague[]
  }
}

interface ITeamByIdResponseTeam {
  team_id: number
  name: string
  code: string
  logo: string
  country: string
  is_national: boolean
  founded: number
  venue_name: string
  venue_surface: string
  venue_address: string
  venue_city: string
  venue_capacity: number
}

export interface ITeamByIdResponse {
  api: {
    results: number
    teams: ITeamByIdResponseTeam[]
  }
}

interface IMatchOddsByMatchIdResponseOddBookmakerBetValue {
  value: string
  odd: string
}

interface IMatchOddsByMatchIdResponseOddBookmakerBet {
  label_id: number
  label_name: string
  values: IMatchOddsByMatchIdResponseOddBookmakerBetValue[]
}

interface IMatchOddsByMatchIdResponseOddBookmaker {
  bookmaker_id: number
  bookmaker_name: string
  bets: IMatchOddsByMatchIdResponseOddBookmakerBet[]
}

interface IMatchOddsByMatchIdResponseOdd {
  fixture: {
    league_id: number
    fixture_id: number
    updateAt: number
  }
  bookmakers: IMatchOddsByMatchIdResponseOddBookmaker[]
}

export interface IMatchOddsByMatchIdResponse {
  api: {
    results: number
    odds: IMatchOddsByMatchIdResponseOdd[]
  }
}

interface ICountriesAvailableResponseCountry {
  country: string
  code: string
  flag: string
}

export interface ICountriesAvailableResponse {
  api: {
    results: number
    odds: IMatchOddsByMatchIdResponseOdd[]
    countries: ICountriesAvailableResponseCountry[]
  }
}

export interface ILastFixturesFromTeamIdResponse_Fixture extends IFixture {}

export interface ILastFixturesFromTeamIdResponse {
  api: {
    results: number
    fixtures: ILastFixturesFromTeamIdResponse_Fixture[]
  }
}

interface IPaging {
  current: number
  total: number
}

interface IOddsByFixtureIdResponse_Odd_Fixture {
  league_id: number
  fixture_id: number
  updateAt: number
}

export interface IOddsByFixtureIdResponse_Odd_Bookmaker_Bet_Value {
  value: string
  odd: number
}

export interface IOddsByFixtureIdResponse_Odd_Bookmaker_Bet {
  label_id: string
  label_name: string
  values: IOddsByFixtureIdResponse_Odd_Bookmaker_Bet_Value[]
}

export interface IOddsByFixtureIdResponse_Odd_Bookmaker {
  bookmaker_id: number
  bookmaker_name: string
  bets: IOddsByFixtureIdResponse_Odd_Bookmaker_Bet[]
}

export interface IOddsByFixtureIdResponse_Odd {
  fixture: IOddsByFixtureIdResponse_Odd_Fixture
  bookmakers: IOddsByFixtureIdResponse_Odd_Bookmaker[]
}

export interface IOddsByFixtureIdResponse {
  api: {
    paging: IPaging
    odds: IOddsByFixtureIdResponse_Odd[]
  }
}

export interface IMatchByFixtureIdResponse {
  api: {
    results: number
    fixtures: IFixture[]
  }
}

export interface ILeaguesBySeasonResponse {
  api: {
    results: number
    leagues: ILeague[]
  }
}

export interface IFixturesByLeagueResponse {
  api: {
    results: number
    fixtures: IFixture[]
  }
}

export interface IDayOddsResponseResponseBookmakerBetValue {
  value: string
  odd: string
}

interface IDayOddsResponseResponseBookmakerBet {
  id: number
  name: string
  values: IDayOddsResponseResponseBookmakerBetValue[]
}

export interface IDayOddsResponseResponseBookmaker {
  id: number
  name: string
  bets: IDayOddsResponseResponseBookmakerBet[]
}

export interface IDayOddsResponseResponse {
  league: {
    id: number
    name: string
    country: string
    logo: string
    flag: string
    season: number
  }
  fixture: {
    id: number
    timezone: string
    date: string
    timestamp: string
  }
  update: string
  bookmakers: IDayOddsResponseResponseBookmaker[]
}

export interface IDayOddsResponse {
  paging: {
    current: number
    total: number
  }
  response: IDayOddsResponseResponse[]
}
