import React, { useCallback } from 'react'
import moment, { Moment } from 'moment'
import { Spin } from 'antd'
import styled from 'styled-components'
import useUrlParamState from '@gepick/components/hooks/useUrlParamState'
import { colors } from '@gepick/assets/styles/cssVariables'
import gql from 'graphql-tag'
import Container from '@gepick/components/container/Container'
import PageTitle from 'components/pageTitle/PageTitle'
import ArrowDatePicker from '@gepick/components/datePicker/ArrowDatePicker'
import { TrackEvents } from 'services/GoogleAnalytics'
import { useQuery } from 'react-apollo-hooks'
import useBreakPoints from '@gepick/components/hooks/useBreakPoints'
import Link from '@gepick/components/link/Link'
import Card from 'components/card/Card'
import { SureBetsQuery, SureBetsQueryVariables } from '../../generatedGraphqlTypes'
import SureBets from './SureBets'
import LockedSureBets from './LockedSureBets'

interface IStyledMainContainerProps {
  isMobile: boolean
}

const StyledMainContainer = styled.div<IStyledMainContainerProps>`
  background: ${colors.black};
  color: ${colors.white};
  width: 100%;
  padding: ${(props) => (props.isMobile ? '16px 8px' : '20px 20px 20px 40px')};
  min-height: 100vh;
`

const sureBetsQuery = gql`
  query SureBetsQuery($args: SureBetsQueryInput!) {
    sureBets(args: $args) {
      unlockedSureBets {
        match {
          startTime
          homeTeamName
          awayTeamName
          goalsHomeTeam
          goalsAwayTeam
          country {
            flag
          }
          countryName
          leagueName
        }
        betLabelId
        sureBetOddsList {
          profit
          createdAt
          values {
            odd
            bookmakerId
            value
          }
        }
      }
      lockedSureBets {
        profit
        matchStartTime
      }
    }
  }
`

const SureBetsPage = () => {
  const { isMobile } = useBreakPoints()
  const [selectedDay, setDay] = useUrlParamState('day', moment().format('YYYY-MM-DD'))

  const sureBetsQueryRes = useQuery<SureBetsQuery, SureBetsQueryVariables>(sureBetsQuery, {
    variables: {
      args: {
        day: selectedDay!,
      },
    },
    skip: !selectedDay,
  })

  const unlockedSurebets = sureBetsQueryRes.data?.sureBets.unlockedSureBets ?? []
  const lockedSurebets = sureBetsQueryRes.data?.sureBets.lockedSureBets ?? []

  const handleWhatSureBetsIsClick = useCallback(() => {
    TrackEvents.sureBetsPage.whatSureBetsIsClick()
    return window.open('https://betblazers.com/guide/sure-bets', '_blank')?.focus()
  }, [])

  const handleDayChange = useCallback(
    (newDay: Moment) => {
      const day = moment(newDay).format('YYYY-MM-DD')
      TrackEvents.sureBetsPage.dayChange(day)
      setDay(day)
      window.scrollTo(0, 0)
    },
    [setDay],
  )

  return (
    <Container>
      <PageTitle
        description="Daily sure bets"
        quote="Gepick - software for bit the bets using sure bets"
        pageTitle="Sure bets"
        hashtag="#sportpredictions #surebets #bet #betting #bettingtips #bettingtipster"
      />
      <StyledMainContainer isMobile={isMobile}>
        <Container justifyContentCenter>
          <Container fullWidth maxWidth={1200}>
            <Container justifyContentSpaceBetween>
              <Container>
                <ArrowDatePicker white date={moment(selectedDay)} onChange={handleDayChange} />
              </Container>
              <Container>
                <Link color={colors.white} underline onClick={handleWhatSureBetsIsClick}>
                  What is a sure bets?
                </Link>
              </Container>
            </Container>
            <Container>
              <Container marginTop={16} marginBottom={16}>
                <Card color={colors.yellow}>
                  Gepick uses third party API for data, please double check odds before bet.
                </Card>
              </Container>
              {sureBetsQueryRes.loading && (
                <Container justifyContentCenter>
                  <Spin />
                </Container>
              )}
              {!sureBetsQueryRes.loading &&
                lockedSurebets.map((item) => {
                  return (
                    <Container marginTop={20}>
                      <LockedSureBets item={item} />
                    </Container>
                  )
                })}
              {!sureBetsQueryRes.loading &&
                unlockedSurebets.map((surebetsItem) => {
                  return (
                    <Container marginTop={20}>
                      <SureBets sureBets={surebetsItem} />
                    </Container>
                  )
                })}
              {!sureBetsQueryRes.loading && unlockedSurebets.length === 0 && lockedSurebets.length === 0 && (
                <Container justifyContentCenter>No sure bets for {selectedDay}.</Container>
              )}
            </Container>
          </Container>
        </Container>
      </StyledMainContainer>
    </Container>
  )
}

export default SureBetsPage
