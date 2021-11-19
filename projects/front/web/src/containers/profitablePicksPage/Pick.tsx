import React, { useMemo } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import Container from '@gepick/components/container/Container'
import Image from '@gepick/components/image/Image'
import Card from 'components/card/Card'
import { colors } from '@gepick/assets/styles/cssVariables'
import useBreakPoints from '@gepick/components/hooks/useBreakPoints'
import { ProfitablePicksPageDataQuery_profitablePicksPageData_picks } from '../../generatedGraphqlTypes'

const StyledTable = styled.table`
  th,
  td {
    padding-left: 8px;
  }

  .red {
    color: ${colors.red};
  }

  .green {
    font-weight: bold;
    color: ${colors.yellow};
  }
`

interface IProps {
  pick: ProfitablePicksPageDataQuery_profitablePicksPageData_picks
}

const Pick: React.FunctionComponent<IProps> = (props) => {
  const { isMobile } = useBreakPoints()

  const {
    isPickWin,
    odd,
    bookmakerName,
    probability,
    profit,
    oddProbability,
    value,
    countryName,
    countryFlag,
    leagueName,
    matchStartTime,
    homeTeamName,
    awayTeamName,
    matchNiceStatus,
    score,
    betNiceName,
  } = props.pick

  const color = useMemo(() => {
    if (isPickWin == null) {
      return colors.primary
    }

    return isPickWin ? colors.green : colors.red
  }, [isPickWin])

  return (
    <Card noJustifyContentCenter color={color}>
      <Container justifyContentSpaceBetween>
        <Container>
          <Container flex>
            <Container marginRight={8}>{moment(matchStartTime).format('YYYY-MM-DD HH:mm')}</Container>
            <Container>{score != null && <>{score}</>}</Container>
          </Container>
          <Container flex>
            <Container marginRight={8}>
              <Image height={45} width={40} alt={countryName + ' flag'} src={countryFlag ?? ''} />
            </Container>
            <Container>
              <Container>
                {countryName} {leagueName}
              </Container>
              <Container flex>
                <Container marginRight={8}>
                  {homeTeamName} - {awayTeamName}
                </Container>
              </Container>
            </Container>
          </Container>
        </Container>
        {!isMobile && (
          <Container marginTop={8} alignItemsCenter>
            <StyledTable>
              <tr>
                <th>Pick</th>
                <th>Bookmaker</th>
                <th>Odd</th>
                <th>Bot probability</th>
                <th>Odd to probability</th>
                <th>Value</th>
                <th>Match status</th>
                <th>Profit</th>
              </tr>
              <tr>
                <td>{betNiceName}</td>
                <td>{bookmakerName}</td>
                <td>{odd}</td>
                <td>{probability}%</td>
                <td>{oddProbability ?? '-'}%</td>
                <td>{value ?? '-'}%</td>
                <td>{matchNiceStatus}</td>
                <td>
                  {profit && (
                    <span className={profit > 0 ? 'green' : 'red'}>
                      {profit > 0 ? '+' : ''}
                      {profit}
                    </span>
                  )}
                </td>
              </tr>
            </StyledTable>
          </Container>
        )}

        {isMobile && (
          <Container>
            <StyledTable>
              <tr>
                <th>pick</th>
                <td>{betNiceName}</td>
              </tr>
              <tr>
                <th>Bookmaker</th>
                <td>{bookmakerName}</td>
              </tr>
              <tr>
                <th>Odd</th>
                <td>{odd}</td>
              </tr>
              <tr>
                <th>Bot probability</th>
                <td>{probability}%</td>
              </tr>
              <tr>
                <th>Odd to probability</th>
                <td>{oddProbability ?? '-'}%</td>
              </tr>
              <tr>
                <th>Value</th>
                <td>{value ?? '-'}%</td>
              </tr>
              <tr>
                <th>Match status</th>
                <td>{matchNiceStatus}</td>
              </tr>
              <tr>
                <th>Profit</th>
                <td>
                  {profit && (
                    <span className={profit > 0 ? 'green' : 'red'}>
                      {profit > 0 ? '+' : ''}
                      {profit}
                    </span>
                  )}
                </td>
              </tr>
            </StyledTable>
          </Container>
        )}
      </Container>
    </Card>
  )
}

export default Pick
