import React, { useMemo } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import Container from '@gepick/components/container/Container'
import Image from '@gepick/components/image/Image'
import Card from 'components/card/Card'
import { colors } from '@gepick/assets/styles/cssVariables'
import useBreakPoints from '@gepick/components/hooks/useBreakPoints'
import { PicksExplorerPagePicksQuery_picksExplorerPagePicks_picks } from '../../generatedGraphqlTypes'

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
  pick: PicksExplorerPagePicksQuery_picksExplorerPagePicks_picks
}

const Pick: React.FunctionComponent<IProps> = (props) => {
  const { isMobile } = useBreakPoints()

  const { isPickWin, odd, bookmakerName, probability, profit, oddProbability, value } = props.pick
  const {
    homeTeamName,
    awayTeamName,
    goalsHomeTeam,
    goalsAwayTeam,
    countryName,
    country,
    leagueName,
    startTime,
    niceStatus,
  } = props.pick.match

  const color = useMemo(() => {
    if (isPickWin == null) {
      return colors.primary
    }

    return isPickWin ? colors.green : colors.red
  }, [isPickWin])

  return (
    <Card noJustifyContentCenter color={color}>
      <Container justifyContentSpaceBetween>
        <Container flex>
          <Container marginRight={8}>
            {country && <Image height={45} width={40} alt={countryName + ' flag'} src={country.flag ?? ''} />}
          </Container>
          <Container>
            <Container>
              {countryName} {leagueName}
            </Container>
            <Container flex>
              <Container marginRight={8}>{moment(startTime).format('HH:mm')}</Container>
              <Container marginRight={8}>
                {homeTeamName} - {awayTeamName}
              </Container>
              <Container>
                {goalsHomeTeam != null && goalsAwayTeam != null && (
                  <>
                    {goalsHomeTeam} : {goalsAwayTeam}
                  </>
                )}
              </Container>
            </Container>
          </Container>
        </Container>
        {!isMobile && (
          <Container marginTop={8} alignItemsCenter>
            <StyledTable>
              <tr>
                <th>Bookmaker</th>
                <th>Odd</th>
                <th>Bot probability</th>
                <th>Odd to probability</th>
                <th>Value</th>
                <th>Match status</th>
                <th>Profit</th>
              </tr>
              <tr>
                <td>{bookmakerName}</td>
                <td>{odd}</td>
                <td>{probability}%</td>
                <td>{oddProbability ?? '-'}%</td>
                <td>{value ?? '-'}%</td>
                <td>{niceStatus}</td>
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
                <td>{niceStatus}</td>
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
