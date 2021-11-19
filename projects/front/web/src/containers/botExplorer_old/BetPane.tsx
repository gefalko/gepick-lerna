import React from 'react'
import Container from '@gepick/components/container/Container'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'
import ReportTable from './ReportTable'
import { BotExplorerIntervalReportQuery, BotExplorerIntervalReportQueryVariables } from '../../generatedGraphqlTypes'

const reportQuery = gql`
  query BotExplorerIntervalReportQuery($args: BotExplorerBetReportQueryInput!) {
    botExplorerBetReport(args: $args) {
      intervalKey
      totalPredictions
      totalPredictionsWithResult
      predictionIdList
      totalCorrect
      totalNotCorrect
      correctPercent
    }
  }
`

interface IProps {
  bet: string
  betLabelId: number
  dayFrom: string
  dayTo: string
}

const BetPane: React.FunctionComponent<IProps> = (props) => {
  const botDockerImage = 'gepickcom/poiison:version1'

  const reportRes = useQuery<BotExplorerIntervalReportQuery, BotExplorerIntervalReportQueryVariables>(reportQuery, {
    variables: {
      args: {
        botDockerImage,
        betLabelId: props.betLabelId,
        bet: props.bet,
        dayFrom: props.dayFrom,
        dayTo: props.dayTo,
      },
    },
  })

  const reportByIntervalList = reportRes.data?.botExplorerBetReport ?? []

  return (
    <Container>
      <ReportTable
        loading={reportRes.loading}
        dayFrom={props.dayFrom}
        dayTo={props.dayTo}
        bet={props.bet}
        betLabelId={props.betLabelId}
        botDockerImage={botDockerImage}
        tableData={reportByIntervalList}
      />
    </Container>
  )
}

export default BetPane
