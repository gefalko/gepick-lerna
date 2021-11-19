import React from 'react'
import styled from 'styled-components'
import { map } from 'lodash'
import Container from '@gepick/components/container/Container'
import { PredictionsPageMatchesQueryV2_predictionsPageMatchesV2 } from 'generatedGraphqlTypes'
import Card from 'components/card/Card'
import { colors } from '@gepick/assets/styles/cssVariables'
import { BetLabels } from '@gepick/utils/src/BetLabels'
import PredictionsPageMatchDetails from './PredictionsPageMatchDetails'
import PredictionsPageMatchOdds from './PredictionsPageMatchOdds'
import PredictionsPageMatchPredictions from './PredictionsPageMatchPredictions'

const StyledOddsAndPredictionsContainer = styled(Container)`
  border-top: 1px solid ${colors.green};
  margin-top: 5px;
  padding-top: 5px;
`

const StyledContainer = styled(Container)`
  font-size: 12px;
  overflow-x: auto;

  .betLabelName {
    text-align: center;
  }

  .betName {
    text-align: center;
    margin-right: 5px;
    margin-left: 5px;
  }

  .odd {
    text-align: center;
  }
`

interface IProps {
  match: PredictionsPageMatchesQueryV2_predictionsPageMatchesV2
}

const PredictionsPageMatch: React.FunctionComponent<IProps> = (props) => {
  const hasOdds = props.match.matchOddsByBookmaker.length > 0
  const hasProbabilities = props.match.matchPredictionsByBot.length > 0

  return (
    <Card noJustifyContentCenter color={colors.green}>
      <Container>
        <PredictionsPageMatchDetails match={props.match} />
        {(hasOdds || hasProbabilities) && (
          <StyledOddsAndPredictionsContainer>
            <StyledContainer>
              <table>
                <tr className="betLabelName">
                  <td rowSpan={2}>&nbsp;</td>
                  <th colSpan={3} scope="colgroup">
                    {BetLabels.MatchWinner.name}
                  </th>
                  <th colSpan={12} scope="colgroup">
                    {BetLabels.GoalsOverUnder.name}
                  </th>
                </tr>
                <tr>
                  {map(BetLabels.MatchWinner.values, (valuesItem) => {
                    return (
                      <th key={valuesItem} className="betName" scope="col">
                        {valuesItem}
                      </th>
                    )
                  })}
                  {map(BetLabels.GoalsOverUnder.values, (valuesItem) => {
                    return (
                      <th key={valuesItem} className="betName" scope="col">
                        {valuesItem}
                      </th>
                    )
                  })}
                </tr>
                {hasOdds && <PredictionsPageMatchOdds oddsByBookmaker={props.match.matchOddsByBookmaker} />}
                {hasProbabilities && (
                  <PredictionsPageMatchPredictions predictionsByBot={props.match.matchPredictionsByBot} />
                )}
              </table>
            </StyledContainer>
          </StyledOddsAndPredictionsContainer>
        )}
      </Container>
    </Card>
  )
}

export default React.memo(PredictionsPageMatch)
