import React from 'react'
import { round } from 'lodash'
import styled from 'styled-components'
import moment from 'moment'
import { colors } from '@gepick/assets/styles/cssVariables'
import Container from '@gepick/components/container/Container'
import Image from '@gepick/components/image/Image'
import { getBookmakerName } from '@gepick/utils/src/bookmakers'
import useBreakPoints from '@gepick/components/hooks/useBreakPoints'
import {
  SureBetsQuery_sureBets_unlockedSureBets,
  SureBetsQuery_sureBets_unlockedSureBets_sureBetOddsList,
} from '../../generatedGraphqlTypes'

const StyledSureBetsContainer = styled(Container)`
  border: 1px solid ${colors.green};
  padding: 20px;
`

const StyledProfitContainer = styled(Container)`
  color: #67c50a;
`

const StyledSureBetsOddsListItemContainer = styled(Container)`
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
`

const StyledHeader = styled(Container)`
  font-weight: 700;
`
interface IProps {
  sureBets: SureBetsQuery_sureBets_unlockedSureBets
}

interface ISureBetsOddsListItemProps {
  item: SureBetsQuery_sureBets_unlockedSureBets_sureBetOddsList
}

const SureBetsOddsListItem: React.FunctionComponent<ISureBetsOddsListItemProps> = (props) => {
  const { isMobile } = useBreakPoints()
  const totalStake = round(
    props.item.values.reduce((sum, valuesItem) => {
      const stake = round(100 / valuesItem.odd, 2)

      return sum + stake
    }, 0),
    2,
  )

  const bankroll = 100

  if (isMobile) {
    return (
      <Container fullWidth>
        <Container>Bankroll: {bankroll} &euro;</Container>
        {props.item.values.map((valuesItem) => {
          const stake = round(100 / valuesItem.odd, 2)
          const stakePercent = stake / totalStake
          const realStake = round(bankroll * stakePercent, 2)

          const profit = round(realStake * valuesItem.odd - bankroll, 2)
          const profitPercent = round((profit / bankroll) * 100, 2)
          const win = round(realStake * valuesItem.odd, 2)

          return (
            <Container marginTop={20} justifyContentSpaceBetween fullWidth>
              <StyledHeader marginRight={20}>
                <Container>Bet</Container>
                <Container>Bookmaker</Container>
                <Container>Odd</Container>
                <Container>Stake</Container>
                <Container>Win</Container>
                <Container>Sure Profit</Container>
              </StyledHeader>
              <Container marginRight={10} minWidth={90}>
                <Container>{valuesItem.value}</Container>
                <Container>{getBookmakerName(valuesItem.bookmakerId)}</Container>
                <Container>{valuesItem.odd}</Container>
                <Container>{realStake}&euro;</Container>
                <Container>{win}&euro;</Container>
                <StyledProfitContainer>
                  +{profit}&euro; +{profitPercent}%
                </StyledProfitContainer>
              </Container>
            </Container>
          )
        })}
      </Container>
    )
  }

  return (
    <Container flex>
      <StyledSureBetsOddsListItemContainer flex>
        <StyledHeader marginRight={20}>
          <Container>Bet</Container>
          <Container>Bookmaker</Container>
          <Container>Odd</Container>
          <Container>Stake</Container>
          <Container>Win</Container>
          <Container>Sure Profit</Container>
        </StyledHeader>
        {props.item.values.map((valuesItem) => {
          const stake = round(100 / valuesItem.odd, 2)
          const stakePercent = stake / totalStake
          const realStake = round(bankroll * stakePercent, 2)

          const profit = round(realStake * valuesItem.odd - bankroll, 2)
          const profitPercent = round((profit / bankroll) * 100, 2)
          const win = round(realStake * valuesItem.odd, 2)

          return (
            <Container marginRight={10} minWidth={90}>
              <Container>{valuesItem.value}</Container>
              <Container>{getBookmakerName(valuesItem.bookmakerId)}</Container>
              <Container>{valuesItem.odd}</Container>
              <Container>{realStake}&euro;</Container>
              <Container>{win}&euro;</Container>
              <StyledProfitContainer>+{profit}&euro;</StyledProfitContainer>
              <StyledProfitContainer>+{profitPercent}%</StyledProfitContainer>
            </Container>
          )
        })}
        <Container marginRight={10}>
          <Container>Bankroll</Container>
          <Container>&nbsp;</Container>
          <Container>&nbsp;</Container>
          <Container>{bankroll}&euro;</Container>
          <Container>&nbsp;</Container>
        </Container>
      </StyledSureBetsOddsListItemContainer>
    </Container>
  )
}

const SureBets: React.FunctionComponent<IProps> = (props) => {
  const { match } = props.sureBets

  return (
    <StyledSureBetsContainer>
      <Container justifyContentSpaceBetween>
        <Container marginBottom={20} minWidth={300}>
          <Container>{moment(props.sureBets.match.startTime).format('YYYY-MM-DD HH:mm')}</Container>
          <Container alignItemsCenter>
            <Container paddingRight={10}>
              <Image height={45} width={40} alt="country flag" src={match.country.flag ?? ''} />
            </Container>
            <Container>
              <Container>{match.countryName}</Container>
              <Container>{match.leagueName}</Container>
            </Container>
          </Container>
          <Container flex>
            <Container>
              {match.homeTeamName} - {match.awayTeamName}
            </Container>
          </Container>
          {match.goalsHomeTeam != null && match.goalsAwayTeam != null && (
            <Container>
              {match.goalsHomeTeam} : {match.goalsAwayTeam}
            </Container>
          )}
        </Container>
        <Container>
          {props.sureBets.sureBetOddsList.map((sureBetOddsListItem) => {
            return <SureBetsOddsListItem item={sureBetOddsListItem} />
          })}
        </Container>
      </Container>
    </StyledSureBetsContainer>
  )
}

export default SureBets
