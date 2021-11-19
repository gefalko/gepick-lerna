import React from 'react'
import Container from '@gepick/components/container/Container'
import Image from '@gepick/components/image/Image'
import { IntervalPicksQuery_intervalPicks_unlockedPicks } from '../../generatedGraphqlTypes'

interface IPickProps {
  bet: string
  pick: IntervalPicksQuery_intervalPicks_unlockedPicks
}

const Pick: React.FunctionComponent<IPickProps> = (props) => {
  const {
    countryFlag,
    countryName,
    leagueName,
    matchStartTime,
    homeTeamName,
    awayTeamName,
    score,
    oddSize,
  } = props.pick
  return (
    <tr>
      <td>
        <Container marginRight={10}>{matchStartTime}</Container>
      </td>
      <td>
        <Container marginRight={10}>
          <Image height={45} width={40} alt="country flag" src={countryFlag ?? ''} />
        </Container>
      </td>
      <td>
        <Container marginRight={20}>
          <Container>
            {countryName} {leagueName}
          </Container>
          <Container flex fullWidth>
            <Container marginRight={20}>
              <Container>
                {homeTeamName} - {awayTeamName}
              </Container>
            </Container>
          </Container>
        </Container>
      </td>
      <td>
        <Container marginRight={10}>{props.bet}</Container>
      </td>
      <td>
        <Container marginRight={10}>{oddSize}</Container>
      </td>
      <td>
        <Container marginRight={10}>
          {score?.halftime && (
            <>
              ({score?.halftime}) {score?.fulltime}
            </>
          )}
        </Container>
      </td>
    </tr>
  )
}

interface IProps {
  bet: string
  unlockedPicks: IntervalPicksQuery_intervalPicks_unlockedPicks[]
}

const UnlockedPicksTable: React.FunctionComponent<IProps> = (props) => {
  return (
    <table>
      <th>&nbsp;</th>
      <th>&nbsp;</th>
      <th>Match</th>
      <th>Pick</th>
      <th>Odd</th>
      <th>Result</th>
      {props.unlockedPicks.map((pick) => (
        <Pick bet={props.bet} pick={pick} />
      ))}
    </table>
  )
}

export default UnlockedPicksTable
