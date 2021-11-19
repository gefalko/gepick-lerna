import React, { useCallback, useState } from 'react'
import { Spin } from 'antd'
import gql from 'graphql-tag'
import styled from 'styled-components'
import Container from '@gepick/components/container/Container'
import useBreakPoints from '@gepick/components/hooks/useBreakPoints'
import PageTitle from 'components/pageTitle/PageTitle'
import { colors } from '@gepick/assets/styles/cssVariables'
import Brandbook from 'components/brandbook/Branbook'
import apolloClient from 'services/ApolloClient'
import SettingsSideBar, { IPredictSettings } from './SettingsSideBar'
import {
  PicksExplorerPagePicksQuery,
  PicksExplorerPagePicksQueryVariables,
  PicksExplorerPagePicksQuery_picksExplorerPagePicks_picks,
  PicksExplorerPagePicksQuery_picksExplorerPagePicks_statistic,
} from '../../generatedGraphqlTypes'
import Pick from './Pick'
import Statistic from './Statistic'

const picksExplorerPageQuery = gql`
  query PicksExplorerPagePicksQuery($args: PicksExplorerPagePicksInput!) {
    picksExplorerPagePicks(args: $args) {
      statistic {
        total
        totalFinished
        totalCorrect
        totalNotCorrect
        totalProfit
        profitPerPick
      }
      picks {
        probability
        oddProbability
        value
        profit
        odd
        bookmakerName
        isPickWin
        match {
          country {
            flag
          }
          niceStatus
          startTime
          countryName
          leagueName
          homeTeamName
          awayTeamName
          goalsHomeTeam
          goalsAwayTeam
        }
      }
    }
  }
`

const StyledMainContainer = styled.div<{ isMobile: boolean }>`
  background: ${colors.black};
  color: ${colors.white};
  flex-grow: 1;
  padding: ${({ isMobile }) => (isMobile ? '5px' : '20px')};
  min-height: 100vh;
  padding-left: ${({ isMobile }) => (isMobile ? '15px' : '40px')};
`

const PicksExplorerPage: React.FunctionComponent<{}> = () => {
  const { isMobile } = useBreakPoints()
  const [picks, setPicks] = useState<PicksExplorerPagePicksQuery_picksExplorerPagePicks_picks[]>([])
  const [statistic, setStatistic] = useState<PicksExplorerPagePicksQuery_picksExplorerPagePicks_statistic>()
  const [loading, setLoading] = useState<boolean>(false)

  const handlePredict = useCallback(async (settings: IPredictSettings) => {
    setLoading(true)
    const { data } = await apolloClient.query<PicksExplorerPagePicksQuery, PicksExplorerPagePicksQueryVariables>({
      query: picksExplorerPageQuery,
      variables: {
        args: {
          day: settings.day,
          probabilityFrom: settings.probabilitiesFrom,
          probabilityTo: settings.probabilitiesTo,
          betLabelId: settings.betLabelId,
          bet: settings.bet,
          botDockerImage: settings.botDockerImage,
          valueFrom: settings.valueFrom,
          valueTo: settings.valueTo,
          oddProbabilityFrom: settings.oddProbabilityFrom,
          oddProbabilityTo: settings.oddProbabilityTo,
          oddIndex: settings.oddIndex,
        },
      },
    })

    if (data?.picksExplorerPagePicks) {
      setPicks(data.picksExplorerPagePicks.picks ?? [])
      setStatistic(data.picksExplorerPagePicks.statistic)
    }

    setLoading(false)
  }, [])

  return (
    <Container>
      <PageTitle pageTitle="Picks Explorer" />
      <Container flex noWrap>
        <SettingsSideBar onPredict={handlePredict} />
        <StyledMainContainer isMobile={isMobile}>
          {loading && (
            <Container justifyContentCenter>
              <Spin />
            </Container>
          )}
          {!loading && (
            <>
              {statistic && (
                <Container marginBottom={24}>
                  <Container marginBottom={8}>
                    <Brandbook type="h3">Picks statistic</Brandbook>
                  </Container>
                  <Statistic statistic={statistic} />
                </Container>
              )}
              {picks.length > 0 && (
                <Container>
                  <Container marginBottom={8}>
                    <Brandbook type="h3">Picks</Brandbook>
                  </Container>
                  {picks.map((picksItem) => {
                    return (
                      <Container marginBottom={16}>
                        <Pick pick={picksItem} />
                      </Container>
                    )
                  })}
                </Container>
              )}
            </>
          )}
        </StyledMainContainer>
      </Container>
    </Container>
  )
}

export default PicksExplorerPage
