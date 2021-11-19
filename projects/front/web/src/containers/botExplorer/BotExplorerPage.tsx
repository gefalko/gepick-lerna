import React, { useCallback, useState } from 'react'
import gql from 'graphql-tag'
import { Spin } from 'antd'
import styled from 'styled-components'
import useBreakPoints from '@gepick/components/hooks/useBreakPoints'
import apolloClient from 'services/ApolloClient'
import Container from '@gepick/components/container/Container'
import PageTitle from 'components/pageTitle/PageTitle'
import ReportTable from './ReportTable'
import { BotExplorerReportQuery, BotExplorerReportQueryVariables } from '../../generatedGraphqlTypes'
import SettingsSideBar, { ISettings } from './SettingsSideBar'

const botExplorerReportQuery = gql`
  query BotExplorerReportQuery($args: BotExplorerReportQueryInput!) {
    botExplorerReport(args: $args) {
      overallStatistic {
        total
        totalFinished
        totalCorrect
        totalNotCorrect
        totalProfit
        profitPerPick
      }
      reports {
        day
        statistic {
          total
          totalFinished
          totalCorrect
          totalNotCorrect
          totalProfit
          profitPerPick
        }
      }
    }
  }
`

const StyledMainContainer = styled.div<{ isMobile: boolean }>`
  flex-grow: 1;
  padding: ${({ isMobile }) => (isMobile ? '5px' : '20px')};
  min-height: 100vh;
  padding-left: ${({ isMobile }) => (isMobile ? '15px' : '40px')};
`

const BotExplorerPage: React.FunctionComponent<{}> = () => {
  const { isMobile } = useBreakPoints()
  const [queryData, setQueryData] = useState<BotExplorerReportQuery>()
  const [loading, setLoading] = useState<boolean>(false)
  const [settings, setSettings] = useState<ISettings>()

  const handleGenerateReport = useCallback(async (newSettings) => {
    setLoading(true)
    const { data } = await apolloClient.query<BotExplorerReportQuery, BotExplorerReportQueryVariables>({
      query: botExplorerReportQuery,
      variables: {
        args: {
          botDockerImage: newSettings.botDockerImage,
          betLabelId: newSettings.betLabelId,
          bet: newSettings.bet,
          dayFrom: newSettings.fromDay,
          dayTo: newSettings.toDay,
          probabilityFrom: newSettings.probabilityFrom,
          probabilityTo: newSettings.probabilityTo,
          oddProbabilityFrom: newSettings.oddProbabilityFrom,
          oddProbabilityTo: newSettings.oddProbabilityTo,
          valueFrom: newSettings.valueFrom,
          valueTo: newSettings.valueTo,
          oddIndex: newSettings.oddIndex,
        },
      },
    })

    setSettings(newSettings)
    setQueryData(data)
    setLoading(false)
  }, [])

  return (
    <Container>
      <PageTitle pageTitle="Bot Explorer" />
      <Container flex noWrap>
        <SettingsSideBar onGenerateReport={handleGenerateReport} />
        <StyledMainContainer isMobile={isMobile}>
          {loading && (
            <Container justifyContentCenter>
              <Spin tip="it will take a few time..." />
            </Container>
          )}
          {!loading && settings && queryData && (
            <ReportTable
              settings={settings}
              data={queryData.botExplorerReport.reports}
              overallReport={queryData.botExplorerReport.overallStatistic}
            />
          )}
        </StyledMainContainer>
      </Container>
    </Container>
  )
}

export default BotExplorerPage
