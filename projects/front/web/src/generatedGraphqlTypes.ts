/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LoginWithPatreon
// ====================================================

export interface LoginWithPatreon_loginWithPatreon {
  __typename: "Token";
  token: string;
}

export interface LoginWithPatreon {
  loginWithPatreon: LoginWithPatreon_loginWithPatreon;
}

export interface LoginWithPatreonVariables {
  code: string;
  redirectUrl: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: VerifyEmailMutation
// ====================================================

export interface VerifyEmailMutation {
  verifyEmail: boolean;
}

export interface VerifyEmailMutationVariables {
  token: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LoginWithEmailMutation
// ====================================================

export interface LoginWithEmailMutation {
  loginWithEmail: string;
}

export interface LoginWithEmailMutationVariables {
  data: LoginInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AskResetPasswordMutation
// ====================================================

export interface AskResetPasswordMutation {
  askResetPassword: boolean;
}

export interface AskResetPasswordMutationVariables {
  email: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ResetPasswordMutation
// ====================================================

export interface ResetPasswordMutation {
  resetPassword: boolean;
}

export interface ResetPasswordMutationVariables {
  token: string;
  newPassword: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RegistrationWithEmailMutation
// ====================================================

export interface RegistrationWithEmailMutation {
  registrationWithEmail: string;
}

export interface RegistrationWithEmailMutationVariables {
  payload: RegistrationInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BotsQuery
// ====================================================

export interface BotsQuery_bots {
  __typename: "PredictionBot";
  dockerImage: string;
}

export interface BotsQuery {
  bots: BotsQuery_bots[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BookamkerExplorerReportQuery
// ====================================================

export interface BookamkerExplorerReportQuery_bookmakerExplorerReport_items {
  __typename: "BookmakerExplorer_intervalReport";
  bet: string;
  intervalKey: string;
  totalCorrect: number;
  totalIncorrect: number;
  averageOdd: number | null;
  averageProbability: number | null;
  profit: number;
  totalWithResults: number;
  bookmakerOccuracyPercent: number | null;
  diffStatus: number | null;
}

export interface BookamkerExplorerReportQuery_bookmakerExplorerReport {
  __typename: "BookmakerPerformanceReport";
  items: BookamkerExplorerReportQuery_bookmakerExplorerReport_items[];
}

export interface BookamkerExplorerReportQuery {
  bookmakerExplorerReport: BookamkerExplorerReportQuery_bookmakerExplorerReport;
}

export interface BookamkerExplorerReportQueryVariables {
  args: BookmakerExplorerReportQueryInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BookmakerExplorerIntervalReportQuery
// ====================================================

export interface BookmakerExplorerIntervalReportQuery_bookmakerExplorerIntervalReport_items {
  __typename: "BookmakerExplorer_intervalReport";
  bet: string;
  intervalKey: string;
  betLabelId: number;
  year: number;
  yearMonth: number;
  monthDay: number;
  totalCorrect: number;
  totalIncorrect: number;
  averageOdd: number | null;
  averageProbability: number | null;
  profit: number;
  totalWithResults: number;
  bookmakerOccuracyPercent: number | null;
  diffStatus: number | null;
}

export interface BookmakerExplorerIntervalReportQuery_bookmakerExplorerIntervalReport {
  __typename: "BookmakerPerformanceReport";
  items: BookmakerExplorerIntervalReportQuery_bookmakerExplorerIntervalReport_items[];
}

export interface BookmakerExplorerIntervalReportQuery {
  bookmakerExplorerIntervalReport: BookmakerExplorerIntervalReportQuery_bookmakerExplorerIntervalReport;
}

export interface BookmakerExplorerIntervalReportQueryVariables {
  args: BookmakerExplorerIntervalReportQueryInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BotExplorerIntervalReportQuery
// ====================================================

export interface BotExplorerIntervalReportQuery_botExplorerBetReport {
  __typename: "BotIntervalReport";
  intervalKey: string;
  totalPredictions: number;
  totalPredictionsWithResult: number;
  predictionIdList: string[];
  totalCorrect: number;
  totalNotCorrect: number;
  correctPercent: number;
}

export interface BotExplorerIntervalReportQuery {
  botExplorerBetReport: BotExplorerIntervalReportQuery_botExplorerBetReport[];
}

export interface BotExplorerIntervalReportQueryVariables {
  args: BotExplorerBetReportQueryInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BotIntervalPredictionsQuery
// ====================================================

export interface BotIntervalPredictionsQuery_botIntervalPredictions_statistic {
  __typename: "MatchPredictionsStatistic";
  total: number;
  totalWithResultAndOdd: number;
  totalCorrect: number;
  totalNotCorrect: number;
  totalProfit: number;
  profitPerPick: number;
  roi: number;
}

export interface BotIntervalPredictionsQuery_botIntervalPredictions_picks_match {
  __typename: "Match";
  homeTeamName: string;
  awayTeamName: string;
  goalsHomeTeam: number | null;
  goalsAwayTeam: number | null;
}

export interface BotIntervalPredictionsQuery_botIntervalPredictions_picks {
  __typename: "MatchPredictionsPick";
  match: BotIntervalPredictionsQuery_botIntervalPredictions_picks_match;
  profit: number | null;
  oddSize: number | null;
  bookmakerName: string | null;
  isPickWin: boolean | null;
}

export interface BotIntervalPredictionsQuery_botIntervalPredictions {
  __typename: "BotIntervalPredictionsResponse";
  statistic: BotIntervalPredictionsQuery_botIntervalPredictions_statistic;
  picks: BotIntervalPredictionsQuery_botIntervalPredictions_picks[];
}

export interface BotIntervalPredictionsQuery {
  botIntervalPredictions: BotIntervalPredictionsQuery_botIntervalPredictions;
}

export interface BotIntervalPredictionsQueryVariables {
  args: BotIntervalPredictionsInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BotExplorerReportQuery
// ====================================================

export interface BotExplorerReportQuery_botExplorerReport_overallStatistic {
  __typename: "BotExplorerReportStatistic";
  total: number;
  totalFinished: number;
  totalCorrect: number;
  totalNotCorrect: number;
  totalProfit: number;
  profitPerPick: number;
}

export interface BotExplorerReportQuery_botExplorerReport_reports_statistic {
  __typename: "BotExplorerReportStatistic";
  total: number;
  totalFinished: number;
  totalCorrect: number;
  totalNotCorrect: number;
  totalProfit: number;
  profitPerPick: number;
}

export interface BotExplorerReportQuery_botExplorerReport_reports {
  __typename: "BotExplorerReport";
  day: string;
  statistic: BotExplorerReportQuery_botExplorerReport_reports_statistic;
}

export interface BotExplorerReportQuery_botExplorerReport {
  __typename: "BotExplorerReportResponse";
  overallStatistic: BotExplorerReportQuery_botExplorerReport_overallStatistic;
  reports: BotExplorerReportQuery_botExplorerReport_reports[];
}

export interface BotExplorerReportQuery {
  botExplorerReport: BotExplorerReportQuery_botExplorerReport;
}

export interface BotExplorerReportQueryVariables {
  args: BotExplorerReportQueryInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CryptoKlinesQuery
// ====================================================

export interface CryptoKlinesQuery_cryptoKlines {
  __typename: "Kline";
  openTime: number;
  openPrice: number;
  priceChange: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  trueRange: number;
  averageTrueRange: number;
  volume: number;
  assetVolume: number;
  totalTrades: number;
  heikinAshiOpenPrice: number;
  heikinAshiClosePrice: number;
  heikinAshiHighPrice: number;
  heikinAshiLowPrice: number;
  heikinAshiKandleBodySize: number;
  isHeikinAshiDojiCandle: boolean;
  heikinAshiTrendDirection: number;
}

export interface CryptoKlinesQuery {
  cryptoKlines: CryptoKlinesQuery_cryptoKlines[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CryptoStrategyBackTestQuery
// ====================================================

export interface CryptoStrategyBackTestQuery_cryptoStrategyBackTest {
  __typename: "CryproStrategyStatistic";
  timeFrame: string;
  startTime: number;
  endTime: number;
  totalTrades: number;
  winTrades: number;
  lostTrades: number;
  winTradesPercent: number;
}

export interface CryptoStrategyBackTestQuery {
  cryptoStrategyBackTest: CryptoStrategyBackTestQuery_cryptoStrategyBackTest[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PicksExplorerPagePicksQuery
// ====================================================

export interface PicksExplorerPagePicksQuery_picksExplorerPagePicks_statistic {
  __typename: "PicksExplorerPageStatistic";
  total: number;
  totalFinished: number;
  totalCorrect: number;
  totalNotCorrect: number;
  totalProfit: number;
  profitPerPick: number;
}

export interface PicksExplorerPagePicksQuery_picksExplorerPagePicks_picks_match_country {
  __typename: "Country";
  flag: string | null;
}

export interface PicksExplorerPagePicksQuery_picksExplorerPagePicks_picks_match {
  __typename: "Match";
  country: PicksExplorerPagePicksQuery_picksExplorerPagePicks_picks_match_country;
  niceStatus: string;
  startTime: any;
  countryName: string;
  leagueName: string;
  homeTeamName: string;
  awayTeamName: string;
  goalsHomeTeam: number | null;
  goalsAwayTeam: number | null;
}

export interface PicksExplorerPagePicksQuery_picksExplorerPagePicks_picks {
  __typename: "PicksExplorerPagePick";
  probability: number;
  oddProbability: number | null;
  value: number | null;
  profit: number | null;
  odd: number | null;
  bookmakerName: string | null;
  isPickWin: boolean | null;
  match: PicksExplorerPagePicksQuery_picksExplorerPagePicks_picks_match;
}

export interface PicksExplorerPagePicksQuery_picksExplorerPagePicks {
  __typename: "PicksExplorerPagePicksResponse";
  statistic: PicksExplorerPagePicksQuery_picksExplorerPagePicks_statistic;
  picks: PicksExplorerPagePicksQuery_picksExplorerPagePicks_picks[];
}

export interface PicksExplorerPagePicksQuery {
  picksExplorerPagePicks: PicksExplorerPagePicksQuery_picksExplorerPagePicks;
}

export interface PicksExplorerPagePicksQueryVariables {
  args: PicksExplorerPagePicksInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CountriesListQuery
// ====================================================

export interface CountriesListQuery_countriesList {
  __typename: "Country";
  _id: string;
  name: string;
}

export interface CountriesListQuery {
  countriesList: CountriesListQuery_countriesList[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PredictionsPageMatchesQueryV2
// ====================================================

export interface PredictionsPageMatchesQueryV2_predictionsPageMatchesV2_score {
  __typename: "PredictionsPageMatchScore";
  halftime: string | null;
  fulltime: string | null;
}

export interface PredictionsPageMatchesQueryV2_predictionsPageMatchesV2_matchOddsByBookmaker_odds {
  __typename: "MatchOddsByBookmakerOdds";
  bet: string;
  oddSize: number | null;
}

export interface PredictionsPageMatchesQueryV2_predictionsPageMatchesV2_matchOddsByBookmaker {
  __typename: "MatchOddsByBookmaker";
  bookmakerId: number;
  bookmakerName: string;
  odds: PredictionsPageMatchesQueryV2_predictionsPageMatchesV2_matchOddsByBookmaker_odds[];
}

export interface PredictionsPageMatchesQueryV2_predictionsPageMatchesV2_matchPredictionsByBot_predictions {
  __typename: "MatchPredictionsByBotPredictions";
  bet: string;
  probability: number | null;
}

export interface PredictionsPageMatchesQueryV2_predictionsPageMatchesV2_matchPredictionsByBot {
  __typename: "MatchPredictionsByBot";
  botDockerImage: string;
  predictions: PredictionsPageMatchesQueryV2_predictionsPageMatchesV2_matchPredictionsByBot_predictions[];
}

export interface PredictionsPageMatchesQueryV2_predictionsPageMatchesV2 {
  __typename: "PredictionsPageMatchV2";
  _id: string;
  formatedStartTime: string;
  countryFlag: string | null;
  countryName: string;
  leagueName: string;
  homeTeamName: string;
  awayTeamName: string;
  score: PredictionsPageMatchesQueryV2_predictionsPageMatchesV2_score | null;
  matchOddsByBookmaker: PredictionsPageMatchesQueryV2_predictionsPageMatchesV2_matchOddsByBookmaker[];
  matchPredictionsByBot: PredictionsPageMatchesQueryV2_predictionsPageMatchesV2_matchPredictionsByBot[];
}

export interface PredictionsPageMatchesQueryV2 {
  predictionsPageMatchesV2: PredictionsPageMatchesQueryV2_predictionsPageMatchesV2[];
}

export interface PredictionsPageMatchesQueryV2Variables {
  args: PredictionsPageMatchesQueryInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProfitablePicksPageDataQuery
// ====================================================

export interface ProfitablePicksPageDataQuery_profitablePicksPageData_statistic {
  __typename: "ProfitablePicksStatistic";
  total: number;
  totalFinished: number;
  totalCorrect: number;
  totalNotCorrect: number;
  totalProfit: number;
  profitPerPick: number;
  averageOdd: number;
  correctAverageOdd: number;
}

export interface ProfitablePicksPageDataQuery_profitablePicksPageData_picks {
  __typename: "ProfitablePick";
  probability: number;
  oddProbability: number;
  value: number;
  profit: number | null;
  odd: number;
  bookmakerName: string;
  betNiceName: string;
  isPickWin: boolean | null;
  countryFlag: string | null;
  matchNiceStatus: string;
  matchStartTime: any;
  countryName: string;
  leagueName: string;
  homeTeamName: string;
  awayTeamName: string;
  score: string | null;
}

export interface ProfitablePicksPageDataQuery_profitablePicksPageData {
  __typename: "ProfitablePicksPageData";
  statistic: ProfitablePicksPageDataQuery_profitablePicksPageData_statistic;
  picks: ProfitablePicksPageDataQuery_profitablePicksPageData_picks[];
}

export interface ProfitablePicksPageDataQuery {
  profitablePicksPageData: ProfitablePicksPageDataQuery_profitablePicksPageData;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DayMatchesQuery
// ====================================================

export interface DayMatchesQuery_matchesByDay {
  __typename: "Match";
  _id: string;
  startTime: any;
  status: MatchStatusEnum;
  niceStatus: string;
  goalsHomeTeam: number | null;
  goalsAwayTeam: number | null;
  leagueName: string;
  countryName: string;
  homeTeamName: string;
  awayTeamName: string;
}

export interface DayMatchesQuery {
  matchesByDay: DayMatchesQuery_matchesByDay[];
}

export interface DayMatchesQueryVariables {
  props: MatchesByDayQueryInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UploadBotMutation
// ====================================================

export interface UploadBotMutation_uploadBot {
  __typename: "UploadBotResponse";
  botId: string;
  dockerImage: string;
}

export interface UploadBotMutation {
  uploadBot: UploadBotMutation_uploadBot;
}

export interface UploadBotMutationVariables {
  props: UploadBotMutationInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SureBetsQuery
// ====================================================

export interface SureBetsQuery_sureBets_unlockedSureBets_match_country {
  __typename: "Country";
  flag: string | null;
}

export interface SureBetsQuery_sureBets_unlockedSureBets_match {
  __typename: "Match";
  startTime: any;
  homeTeamName: string;
  awayTeamName: string;
  goalsHomeTeam: number | null;
  goalsAwayTeam: number | null;
  country: SureBetsQuery_sureBets_unlockedSureBets_match_country;
  countryName: string;
  leagueName: string;
}

export interface SureBetsQuery_sureBets_unlockedSureBets_sureBetOddsList_values {
  __typename: "SureBetOddsValue";
  odd: number;
  bookmakerId: number;
  value: string;
}

export interface SureBetsQuery_sureBets_unlockedSureBets_sureBetOddsList {
  __typename: "SureBetOdds";
  profit: number;
  createdAt: any;
  values: SureBetsQuery_sureBets_unlockedSureBets_sureBetOddsList_values[];
}

export interface SureBetsQuery_sureBets_unlockedSureBets {
  __typename: "SureBets";
  match: SureBetsQuery_sureBets_unlockedSureBets_match;
  betLabelId: BetLabelIdEnum;
  sureBetOddsList: SureBetsQuery_sureBets_unlockedSureBets_sureBetOddsList[];
}

export interface SureBetsQuery_sureBets_lockedSureBets {
  __typename: "LockedSureBets";
  profit: number;
  matchStartTime: any;
}

export interface SureBetsQuery_sureBets {
  __typename: "SureBetsResponse";
  unlockedSureBets: SureBetsQuery_sureBets_unlockedSureBets[];
  lockedSureBets: SureBetsQuery_sureBets_lockedSureBets[];
}

export interface SureBetsQuery {
  sureBets: SureBetsQuery_sureBets;
}

export interface SureBetsQueryVariables {
  args: SureBetsQueryInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: IntervalPicksQuery
// ====================================================

export interface IntervalPicksQuery_intervalPicks_partner {
  __typename: "Partner";
  name: string;
  valuePicksUnlockTillDate: string | null;
}

export interface IntervalPicksQuery_intervalPicks_statistic {
  __typename: "IntervalPicksResponseStatistic";
  total: number;
  totalWithResult: number;
  totalCorrect: number;
  totalNotCorrect: number;
  correctPercent: number;
  averageOdd: number | null;
  profit: number;
  profitPerPick: number;
  roi: number;
}

export interface IntervalPicksQuery_intervalPicks_unlockedPicks_score {
  __typename: "IntervalPickScore";
  halftime: string | null;
  fulltime: string | null;
}

export interface IntervalPicksQuery_intervalPicks_unlockedPicks {
  __typename: "IntervalPick";
  homeTeamName: string;
  awayTeamName: string;
  matchStartTime: string;
  countryFlag: string;
  countryName: string;
  leagueName: string;
  oddSize: number | null;
  score: IntervalPicksQuery_intervalPicks_unlockedPicks_score | null;
}

export interface IntervalPicksQuery_intervalPicks_lockedPicks {
  __typename: "LockedIntervalPick";
  matchStartTime: string;
  countryFlag: string;
  countryName: string;
  leagueName: string;
}

export interface IntervalPicksQuery_intervalPicks {
  __typename: "IntervalPicksResponse";
  isPatron: boolean;
  partner: IntervalPicksQuery_intervalPicks_partner | null;
  statistic: IntervalPicksQuery_intervalPicks_statistic | null;
  unlockedPicks: IntervalPicksQuery_intervalPicks_unlockedPicks[] | null;
  lockedPicks: IntervalPicksQuery_intervalPicks_lockedPicks[] | null;
}

export interface IntervalPicksQuery {
  intervalPicks: IntervalPicksQuery_intervalPicks;
}

export interface IntervalPicksQueryVariables {
  input: IntervalPicksInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BookmakerExplorerReportStatisticListQuery
// ====================================================

export interface BookmakerExplorerReportStatisticListQuery_bookmakerExplorerReportStatisticList_items {
  __typename: "BookmakerExplorerIntervalReportStatisticItem";
  intervalKey: string;
  betLabelId: number;
  betLabelName: string;
  bet: string;
  allTimeRoi: number;
}

export interface BookmakerExplorerReportStatisticListQuery_bookmakerExplorerReportStatisticList {
  __typename: "bookmakerExplorerReportStatisticListResponse";
  items: BookmakerExplorerReportStatisticListQuery_bookmakerExplorerReportStatisticList_items[];
}

export interface BookmakerExplorerReportStatisticListQuery {
  bookmakerExplorerReportStatisticList: BookmakerExplorerReportStatisticListQuery_bookmakerExplorerReportStatisticList;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MeQuery
// ====================================================

export interface MeQuery_me_patreonData {
  __typename: "PatreonData";
  will_pay_amount_cents: number | null;
}

export interface MeQuery_me {
  __typename: "Account";
  _id: string;
  email: string | null;
  fullName: string | null;
  thumbUrl: string | null;
  patreonData: MeQuery_me_patreonData | null;
}

export interface MeQuery {
  me: MeQuery_me;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreatePartnerMutation
// ====================================================

export interface CreatePartnerMutation_createPartner {
  __typename: "CreatePartnerResponse";
  partnerName: string;
}

export interface CreatePartnerMutation {
  createPartner: CreatePartnerMutation_createPartner;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PushPartnerUser
// ====================================================

export interface PushPartnerUser {
  pushPartnerUser: boolean;
}

export interface PushPartnerUserVariables {
  args: PushPartnerUserInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PartnerQuery
// ====================================================

export interface PartnerQuery_partner {
  __typename: "PartnerResponse";
  name: string;
  valuePicksUnlockTill: string | null;
}

export interface PartnerQuery {
  partner: PartnerQuery_partner;
}

export interface PartnerQueryVariables {
  args: PartnerInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LoginWithEmail
// ====================================================

export interface LoginWithEmail {
  loginWithEmail: string;
}

export interface LoginWithEmailVariables {
  data: LoginInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RegistrationWithEmail
// ====================================================

export interface RegistrationWithEmail {
  registrationWithEmail: string;
}

export interface RegistrationWithEmailVariables {
  payload: RegistrationInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum BetLabelIdEnum {
  GoalsOverUnder = "GoalsOverUnder",
  MatchWinner = "MatchWinner",
}

export enum MatchStatusEnum {
  BROKEN = "BROKEN",
  CANCELED = "CANCELED",
  EXTRA_TIME = "EXTRA_TIME",
  FINISHED = "FINISHED",
  FINISHED_EXTRA_TIME = "FINISHED_EXTRA_TIME",
  FINISHED_PENELTIES = "FINISHED_PENELTIES",
  FIRST_HALF = "FIRST_HALF",
  HALFTIME = "HALFTIME",
  MATCH_ABANDONED = "MATCH_ABANDONED",
  NOT_STARTED = "NOT_STARTED",
  POSTPONED = "POSTPONED",
  SECOND_HALF = "SECOND_HALF",
  SUSPENDED = "SUSPENDED",
  TECHNICAL_LOSS = "TECHNICAL_LOSS",
  TIME_TO_BE_DEFINED = "TIME_TO_BE_DEFINED",
  WALKOVER = "WALKOVER",
}

export enum ReportPeriodEnum {
  ALL_TIME = "ALL_TIME",
  DAY = "DAY",
  MONTH = "MONTH",
  QUARTER = "QUARTER",
  WEEK = "WEEK",
  YEAR = "YEAR",
}

export interface BookmakerExplorerIntervalReportQueryInput {
  intervalKey: string;
  betLabelId: number;
  periodType: ReportPeriodEnum;
  bet: string;
}

export interface BookmakerExplorerReportQueryInput {
  betLabelId: number;
  year: number;
  yearMonth?: number | null;
  yearWeek?: number | null;
  monthDay?: number | null;
  periodType: ReportPeriodEnum;
}

export interface BotExplorerBetReportQueryInput {
  botDockerImage: string;
  betLabelId: number;
  bet: string;
  dayFrom: string;
  dayTo: string;
}

export interface BotExplorerReportQueryInput {
  botDockerImage: string;
  betLabelId: number;
  bet: string;
  dayFrom: string;
  dayTo: string;
  probabilityFrom: number;
  probabilityTo: number;
  oddProbabilityFrom: number;
  oddProbabilityTo: number;
  valueFrom: number;
  valueTo: number;
  oddIndex: number;
}

export interface BotIntervalPredictionsInput {
  intervalKey: string;
  botDockerImage: string;
  betLabelId: number;
  bet: string;
  dayFrom: string;
  dayTo: string;
}

export interface IntervalPicksInput {
  intervalKey: string;
  betLabelId: number;
  bet: string;
  day: string;
  partnerName?: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface MatchesByDayQueryInput {
  day: string;
  offset?: number | null;
  limit?: number | null;
}

export interface PartnerInput {
  partnerName: string;
}

export interface PicksExplorerPagePicksInput {
  botDockerImage: string;
  betLabelId: number;
  bet: string;
  day: string;
  probabilityFrom: number;
  probabilityTo: number;
  valueFrom: number;
  valueTo: number;
  oddProbabilityFrom: number;
  oddProbabilityTo: number;
  oddIndex: number;
}

export interface PredictionsPageMatchesQueryInput {
  day: string;
  offset: number;
  limit: number;
  coutriesIds?: string[] | null;
}

export interface PushPartnerUserInput {
  partnerName: string;
}

export interface RegistrationInput {
  email: string;
  username: string;
  password: string;
  newsletter: boolean;
}

export interface SureBetsQueryInput {
  day: string;
}

export interface UploadBotMutationInput {
  dockerImage: string;
  gitRepository?: string | null;
  description?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
