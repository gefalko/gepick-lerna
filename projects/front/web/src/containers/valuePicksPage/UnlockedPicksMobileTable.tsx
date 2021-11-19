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
    <tr style={{ borderBottom: '1px solid white' }}>
      <td>
        <Container marginRight={10}>{matchStartTime}</Container>
        <Container>
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
              {homeTeamName} - {awayTeamName}
            </Container>
          </Container>
        </Container>
      </td>
      <td>
        <Container>{props.bet}</Container>
        <Container marginTop={5}>{oddSize}</Container>
        <Container marginTop={5}>
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
    <Container marginTop={16}>
      <table>
        {props.unlockedPicks.map((pick) => (
          <Pick bet={props.bet} pick={pick} />
        ))}
      </table>
    </Container>
  )
}

export default UnlockedPicksTable
