import React, { useMemo } from 'react'
import Container from '@gepick/components/container/Container'
import { colors } from '@gepick/assets/styles/cssVariables'
import { BotIntervalPredictionsQuery_botIntervalPredictions_picks } from '../../../generatedGraphqlTypes'

interface IProps {
  pick: BotIntervalPredictionsQuery_botIntervalPredictions_picks
}

const PredictionExplorerPick: React.FunctionComponent<IProps> = (props) => {
  const { homeTeamName, awayTeamName, goalsHomeTeam, goalsAwayTeam } = props.pick.match
  const { oddSize, bookmakerName, isPickWin, profit } = props.pick

  const color = useMemo(() => {
    if (isPickWin == null) {
      return undefined
    }

    return isPickWin ? colors.green : colors.red
  }, [isPickWin])

  return (
    <Container background={color}>
      {homeTeamName} - {awayTeamName} {goalsHomeTeam}:{goalsAwayTeam} {oddSize} {bookmakerName} {profit}
    </Container>
  )
}

export default PredictionExplorerPick
