import { BetLabels } from '@gepick/utils/src/BetLabels'

export const bookmakerExplorerLabels = {
  MatchWinner: {
    apiFootballLabelId: BetLabels.MatchWinner.apiFootballLabelId,
    name: BetLabels.MatchWinner.name,
    values: {
      Home: 'Home',
      Draw: 'Draw',
      Away: 'Away',
    },
  },
  GoalsOverUnder: {
    apiFootballLabelId: BetLabels.GoalsOverUnder.apiFootballLabelId,
    name: 'Goals Over/Under',
    values: {
      Under0_5: 'Under 0.5',
      Over0_5: 'Over 0.5',
      Under1_5: 'Under 1.5',
    },
  },
}
