import React, { useMemo } from 'react'
import moment from 'moment'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'
import { Table } from 'antd'
import useUrlParamState from '@gepick/components/hooks/useUrlParamState'
import PageTitle from 'components/pageTitle/PageTitle'
import Container from '@gepick/components/container/Container'
import LineChart from '@gepick/components/chartjs/LineChart'
import Breadcrumb from '@gepick/components/breadcrumb/Breadcrumb'
import { getBetLabelByLabelId } from '@gepick/utils/src/BetLabels'
import routes from 'routes/routes'
import {
  ReportPeriodEnum,
  BookmakerExplorerIntervalReportQuery,
  BookmakerExplorerIntervalReportQueryVariables,
} from '../../../generatedGraphqlTypes'

const intervalReportQuery = gql`
  query BookmakerExplorerIntervalReportQuery($args: BookmakerExplorerIntervalReportQueryInput!) {
    bookmakerExplorerIntervalReport(args: $args) {
      items {
        bet
        intervalKey
        betLabelId
        year
        yearMonth
        monthDay
        totalCorrect
        totalIncorrect
        averageOdd
        averageProbability
        profit
        totalWithResults
        bookmakerOccuracyPercent
        diffStatus
      }
    }
  }
`

interface IReport {
  intervalKey: string
}

interface IBookmakerExplorerIntervalReportTableProps {
  reports: IReport[]
}

const BookmakerExplorerIntervalReportTable: React.FunctionComponent<IBookmakerExplorerIntervalReportTableProps> = (
  props,
) => {
  const columns = [
    {
      title: 'Day',
      dataIndex: 'day',
      key: 'day',
    },
    {
      title: 'Interval',
      dataIndex: 'intervalKey',
      key: 'intervalKey',
    },
    {
      title: 'Bookmaker ocurracy',
      dataIndex: 'bookmakerOccuracyPercent',
      key: 'bookmakerOccuracyPercent',
      render: (value: number) => (value != null ? value + '%' : '-'),
    },
    {
      title: 'Total correct',
      dataIndex: 'totalCorrect',
      key: 'totalCorrect',
    },
    {
      title: 'Total incorrect',
      dataIndex: 'totalIncorrect',
      key: 'totalIncorrect',
    },
    {
      title: 'Total with result',
      dataIndex: 'totalWithResults',
      key: 'totalWithResults',
    },
    {
      title: 'Diff',
      dataIndex: 'diffStatus',
      key: 'diffStatus',
      render: (value: number) => (value > 0 ? '+' + value : value),
    },
    {
      title: 'Average odd',
      dataIndex: 'averageOdd',
      key: 'averageOdd',
    },
    {
      title: 'Average probability',
      dataIndex: 'averageProbability',
      key: 'averageProbability',
    },
    {
      title: 'Profit',
      dataIndex: 'profit',
      key: 'profit',
      render: (value: number) => (value > 0 ? '+' + value : value),
    },
  ]

  return <Table pagination={false} size="small" columns={columns} dataSource={props.reports} />
}

const BookmakerExplorerIntervalReportPage: React.FunctionComponent<{}> = () => {
  const [intervalKey] = useUrlParamState('intervalKey')
  const [betLabelId] = useUrlParamState('betLabelId')
  const [bet] = useUrlParamState('bet')
  const [periodType] = useUrlParamState('periodType')
  const [periodValue] = useUrlParamState('periodValue')

  const reportQueryRes = useQuery<BookmakerExplorerIntervalReportQuery, BookmakerExplorerIntervalReportQueryVariables>(
    intervalReportQuery,
    {
      variables: {
        args: {
          betLabelId: parseInt(betLabelId ?? '', 10),
          intervalKey: intervalKey ?? '',
          bet: bet ?? '',
          periodType: ReportPeriodEnum.DAY,
        },
      },
    },
  )

  const reports = reportQueryRes.data?.bookmakerExplorerIntervalReport?.items ?? []

  const betLabel = betLabelId
    ? getBetLabelByLabelId(parseInt(betLabelId, 10))
    : {
        name: '-',
      }

  const sortedReports = React.useMemo(() => {
    const formatedReports = reports.map((report) => {
      const day = moment()
        .set({
          year: report.year,
          month: report.yearMonth,
          date: report.monthDay,
        })
        .format('YYYY-MM-DD')

      return { ...report, day }
    })

    formatedReports.sort(function (a, b) {
      return new Date(a.day).valueOf() - new Date(b.day).valueOf()
    })

    return formatedReports
  }, [reports])

  const [intervalFromString, intervalToString] = intervalKey?.split('-') ?? ''

  const intervalFrom = parseInt(intervalFromString, 10)
  const intervalTo = parseInt(intervalToString, 10)

  const chartData = sortedReports.map((report) => {
    return {
      x: report.day,
      y: report.bookmakerOccuracyPercent!,
    }
  })

  const backgroundColor = sortedReports.map((report) => {
    if (report.diffStatus === 0) {
      return 'red'
    }

    return 'green'
  })

  const chartDatasets = [
    {
      backgroundColor,
      data: chartData,
      fill: false,
      steppedLine: true,
      showLine: false,
    },
    {
      data: chartData.map(() => intervalFrom),
      type: 'line',
      fill: false,
    },
    {
      data: chartData.map(() => intervalTo),
      type: 'line',
      fill: false,
    },
  ]

  const labels = chartData.map((item) => item.x)

  const breadcrumbUrl = useMemo(() => {
    const url = `${routes.bookmakerExplorer}?&betLabelId=${betLabelId}&bet=${bet}`
    if (periodType && periodValue) {
      return `${url}&periodType=${periodType}&periodValue=${periodValue}`
    }

    return url
  }, [betLabelId, bet, periodType, periodValue])

  return (
    <Container margin={20}>
      <PageTitle pageTitle="Bookmaker explorer - interval report" />
      <Container>
        <Breadcrumb
          breadcrumb={[
            {
              url: breadcrumbUrl,
              title: `${betLabel?.name} - ${bet}`,
            },
          ]}
          title={`${intervalKey}%`}
        />
      </Container>
      <hr />
      <Container>
        <Container>
          Probability interval - <b>{intervalKey}%</b>
        </Container>
        <Container>
          BetLabel - <b>{betLabel?.name}</b>
        </Container>
        <Container>
          Bet - <b>{bet}</b>
        </Container>
      </Container>
      <Container height={32} />
      <Container height={300}>
        <LineChart datasets={chartDatasets} labels={labels} />
      </Container>
      <Container height={32} />
      <Container>
        <BookmakerExplorerIntervalReportTable reports={sortedReports} />
      </Container>
    </Container>
  )
}

export default BookmakerExplorerIntervalReportPage
