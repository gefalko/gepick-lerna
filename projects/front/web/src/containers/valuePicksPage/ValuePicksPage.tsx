import React, { useCallback } from 'react'
import gql from 'graphql-tag'
import moment, { Moment } from 'moment'
import { useQuery } from 'react-apollo-hooks'
import styled from 'styled-components'
import { colors } from '@gepick/assets/styles/cssVariables'
import Container from '@gepick/components/container/Container'
import PageTitle from 'components/pageTitle/PageTitle'
import useUrlParamState from '@gepick/components/hooks/useUrlParamState'
import ArrowDatePicker from '@gepick/components/datePicker/ArrowDatePicker'
import useBreakPoints from '@gepick/components/hooks/useBreakPoints'
import { TrackEvents } from 'services/GoogleAnalytics'
import { BookmakerExplorerReportStatisticListQuery } from '../../generatedGraphqlTypes'
import IntervalItem from './IntervalItem'
import IntervalItemWithPicks from './IntervalItemWithPicks'
import Onboarding from './Onboarding'

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

const bookmakerExplorerReportStatisticListQuery = gql`
  query BookmakerExplorerReportStatisticListQuery {
    bookmakerExplorerReportStatisticList {
      items {
        intervalKey
        betLabelId
        betLabelName
        bet
        allTimeRoi
      }
    }
  }
`

const ValuePicksPage = () => {
  const [selectedDay, setDay] = useUrlParamState('day', moment().format('YYYY-MM-DD'))
  const bookmakerExplorerReportStatisticListQueryRes = useQuery<BookmakerExplorerReportStatisticListQuery>(
    bookmakerExplorerReportStatisticListQuery,
  )

  const { isMobile } = useBreakPoints()

  const intervalList =
    bookmakerExplorerReportStatisticListQueryRes?.data?.bookmakerExplorerReportStatisticList?.items ?? []

  const handleDayChange = useCallback(
    (newDay: Moment) => {
      const day = moment(newDay).format('YYYY-MM-DD')
      TrackEvents.valuePicksPage.dayChange(day)
      setDay(day)
      window.scrollTo(0, 0)
    },
    [setDay],
  )

  return (
    <Container>
      <PageTitle
        description="Daily value bet tips"
        quote="Gepick - software for bit the bets"
        pageTitle="Value picks"
        hashtag="#sportpredictions #bet #betting #bettingtips #bettingtipster"
      />
      <StyledMainContainer isMobile={isMobile}>
        <Container id="step" justifyContentCenter>
          <Container id="step2" fullWidth maxWidth={1200}>
            <Container justifyContentSpaceBetween>
              <Container>
                <ArrowDatePicker white date={moment(selectedDay)} onChange={handleDayChange} />
              </Container>
              <Container>
                <Onboarding />
              </Container>
            </Container>
            {intervalList.map((intervalItem) => {
              if (intervalItem.allTimeRoi > 0) {
                return (
                  <Container data-onboarding="interval">
                    {selectedDay && (
                      <IntervalItemWithPicks
                        day={selectedDay}
                        betLabelId={intervalItem.betLabelId}
                        allTimeRoi={intervalItem.allTimeRoi}
                        betLabelName={intervalItem.betLabelName}
                        bet={intervalItem.bet}
                        intervalKey={intervalItem.intervalKey}
                      />
                    )}
                  </Container>
                )
              }

              return (
                <Container data-onboarding="interval">
                  <IntervalItem
                    isMobile={isMobile}
                    betLabelId={intervalItem.betLabelId}
                    allTimeRoi={intervalItem.allTimeRoi}
                    betLabelName={intervalItem.betLabelName}
                    bet={intervalItem.bet}
                    intervalKey={intervalItem.intervalKey}
                  />
                </Container>
              )
            })}
          </Container>
        </Container>
      </StyledMainContainer>
    </Container>
  )
}

export default ValuePicksPage
