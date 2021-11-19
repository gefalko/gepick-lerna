import React, { useCallback } from 'react'
import moment from 'moment'
import gql from 'graphql-tag'
import { Spin } from 'antd'
import styled from 'styled-components'
import { useQuery } from 'react-apollo-hooks'
import { colors } from '@gepick/assets/styles/cssVariables'
import Container from '@gepick/components/container/Container'
import Image from '@gepick/components/image/Image'
import BecomeAPatronButton from '@gepick/components/becomeAPatronButton/BecomeAPatronButton'
import useBreakPoints from '@gepick/components/hooks/useBreakPoints'
import usePartner from 'hooks/usePartner'
import ShareButton from './ShareButton'
import {
  IntervalPicksQuery,
  IntervalPicksQueryVariables,
  IntervalPicksQuery_intervalPicks_lockedPicks,
  IntervalPicksQuery_intervalPicks_statistic,
} from '../../generatedGraphqlTypes'
import IntervalItem from './IntervalItem'
import UnlockedPicksTable from './UnlockedPicksTable'
import UnlockedPicksMobileTable from './UnlockedPicksMobileTable'
import { TrackEvents } from '../../services/GoogleAnalytics'

interface IProps {
  intervalKey: string
  betLabelName: string
  betLabelId: number
  bet: string
  allTimeRoi: number
  day: string
}

const StyledLockedContainer = styled.div`
  -webkit-filter: blur(3px);
  -moz-filter: blur(3px);
  -o-filter: blur(3px);
  -ms-filter: blur(3px);
  filter: blur(3px);
`

interface IStyledStatisticContainerProps {
  isMobile: boolean
}

const StyledStatisticContainer = styled(Container)<IStyledStatisticContainerProps>`
  padding: 10px;
  ${(props) => (props.isMobile ? 'border-bottom' : 'border-left')}: 1px solid ${colors.white};
`

const intervalPicksQuery = gql`
  query IntervalPicksQuery($input: IntervalPicksInput!) {
    intervalPicks(input: $input) {
      isPatron
      partner {
        name
        valuePicksUnlockTillDate
      }
      statistic {
        total
        totalWithResult
        totalCorrect
        totalNotCorrect
        correctPercent
        averageOdd
        profit
        profitPerPick
        roi
      }
      unlockedPicks {
        homeTeamName
        awayTeamName
        matchStartTime
        countryFlag
        countryName
        leagueName
        oddSize
        score {
          halftime
          fulltime
        }
      }
      lockedPicks {
        matchStartTime
        countryFlag
        countryName
        leagueName
      }
    }
  }
`

interface ILockedPickProps {
  pick: IntervalPicksQuery_intervalPicks_lockedPicks
}

const LockedPick: React.FunctionComponent<ILockedPickProps> = (props) => {
  const { countryFlag, countryName, leagueName, matchStartTime } = props.pick
  return (
    <Container flex>
      <Container paddingRight={10}>
        <Image height={45} width={40} alt="country flag" src={countryFlag ?? ''} />
      </Container>
      <Container>
        <Container>
          {countryName} {leagueName}
        </Container>
        <Container flex>
          <Container marginRight={5}>{matchStartTime}</Container>
          <Container marginRight={5}>home team - away team</Container>
        </Container>
      </Container>
    </Container>
  )
}

interface IStatisticProps {
  isMobile: boolean
  statistic: IntervalPicksQuery_intervalPicks_statistic
}

const Staistic: React.FunctionComponent<IStatisticProps> = (props) => {
  const renderItem = (label: string, value: number | string) => {
    return (
      <Container justifyContentSpaceBetween>
        <Container>{label}:</Container>
        <Container>{value}</Container>
      </Container>
    )
  }

  return (
    <StyledStatisticContainer isMobile={props.isMobile} width={props.isMobile ? '100%' : 220}>
      {renderItem('Total picks', props.statistic.total)}
      {renderItem('Total with results picks', props.statistic.totalWithResult)}
      {renderItem('Total correct', props.statistic.totalCorrect)}
      {renderItem('Correct percent', props.statistic.correctPercent + '%')}
      {renderItem('Average odd', props.statistic.averageOdd ?? '-')}
      {renderItem('Profit', (props.statistic.profit ?? '-') + ' units')}
      {renderItem('Profit per pick', (props.statistic.profitPerPick ?? '-') + ' units')}
      {renderItem('ROI', (props.statistic.roi ?? '-') + '%')}
    </StyledStatisticContainer>
  )
}

const IntervalItemWithPicks: React.FunctionComponent<IProps> = (props) => {
  const { partner } = usePartner()
  const intervalPicksQueryRes = useQuery<IntervalPicksQuery, IntervalPicksQueryVariables>(intervalPicksQuery, {
    variables: {
      input: {
        intervalKey: props.intervalKey,
        betLabelId: props.betLabelId,
        day: props.day,
        bet: props.bet,
        partnerName: partner?.name,
      },
    },
  })

  const { isMobileOrTablet, isMobile } = useBreakPoints()

  const unlockedPicks = intervalPicksQueryRes.data?.intervalPicks.unlockedPicks
  const lockedPicks = intervalPicksQueryRes.data?.intervalPicks.lockedPicks
  const statistic = intervalPicksQueryRes.data?.intervalPicks.statistic

  const noPicks = (unlockedPicks ?? []).length === 0 && (lockedPicks ?? []).length === 0
  const isToday = moment().format('YYYY-MM-DD') === props.day

  const handleABecomeAPatronButtonClick = useCallback(() => {
    TrackEvents.valuePicksPage.becomePatronButtonClick()
  }, [])

  return (
    <IntervalItem
      betLabelId={props.betLabelId}
      intervalKey={props.intervalKey}
      betLabelName={props.betLabelName}
      bet={props.bet}
      isMobile={isMobile}
      allTimeRoi={props.allTimeRoi}
    >
      {intervalPicksQueryRes.loading && (
        <Container justifyContentCenter>
          <Spin />
        </Container>
      )}
      {!intervalPicksQueryRes.loading && noPicks && (
        <Container justifyContentCenter>
          <Container>No picks for this interval. {isToday && <>Please try tomorow.</>}</Container>
        </Container>
      )}

      {!noPicks && partner && moment().isBefore(partner.valuePicksUnlockTill) && (
        <Container justifyContentCenter alignItemsCenter marginBottom={20}>
          <Container>Value picks are unlocked till {partner.valuePicksUnlockTill}.</Container>
          <Container>Want more?</Container>
          <Container marginLeft={10}>
            <ShareButton />
          </Container>
        </Container>
      )}

      {(lockedPicks?.length ?? 0) > 0 && (
        <Container>
          <Container color={colors.yellow} justifyContentCenter>
            <b>Unlock today value picks</b>
          </Container>
          <Container justifyContentCenter marginTop={5} marginBottom={5}>
            <Container alignItemsCenter={!isMobile} flex={!isMobile}>
              <BecomeAPatronButton onClick={handleABecomeAPatronButtonClick} />
              <Container justifyContentCenter marginLeft={5} marginRight={5}>
                or
              </Container>
              <ShareButton />
            </Container>
          </Container>
          <Container justifyContentCenter>Already patron? please login</Container>
        </Container>
      )}
      <Container
        flexDirectionColumnReverse={isMobileOrTablet}
        justifyContentSpaceBetween
        data-onboarding={noPicks ? undefined : 'picks'}
      >
        <Container>
          {unlockedPicks && unlockedPicks.length > 0 && (
            <>
              {!isMobileOrTablet && <UnlockedPicksTable unlockedPicks={unlockedPicks} bet={props.bet} />}
              {isMobileOrTablet && <UnlockedPicksMobileTable unlockedPicks={unlockedPicks} bet={props.bet} />}
            </>
          )}
          <StyledLockedContainer>
            {lockedPicks && lockedPicks.map((pick) => <LockedPick pick={pick} />)}
          </StyledLockedContainer>
        </Container>
        {statistic && !noPicks && <Staistic isMobile={isMobile} statistic={statistic} />}
      </Container>
    </IntervalItem>
  )
}

export default IntervalItemWithPicks
