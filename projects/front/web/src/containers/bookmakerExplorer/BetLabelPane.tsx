import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'
import { Link } from 'react-router-dom'
import { Table, Tabs } from 'antd'
import { groupBy, map, head, find } from 'lodash'
import { BetLabelIdEnum, BetLabels } from '@gepick/utils/src/BetLabels'
import Container from '@gepick/components/container/Container'
import LineChart from '@gepick/components/chartjs/LineChart'
import routes from 'routes/routes'
import { bookmakerExplorerLabels } from '@gepick/config/src/bookmakerExplorerConfig'
import useUrlParamState from '@gepick/components/hooks/useUrlParamState'
import {
  BookamkerExplorerReportQuery,
  BookamkerExplorerReportQueryVariables,
  BookamkerExplorerReportQuery_bookmakerExplorerReport_items,
  ReportPeriodEnum,
} from '../../generatedGraphqlTypes'

const { TabPane } = Tabs

const reportQuery = gql`
  query BookamkerExplorerReportQuery($args: BookmakerExplorerReportQueryInput!) {
    bookmakerExplorerReport(args: $args) {
      items {
        bet
        intervalKey
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

interface IData {
  chartData: {
    backgroundColors: string[]
    data: Array<{
      x: string
      y: number
    }>
  }
  tableData: BookamkerExplorerReportQuery_bookmakerExplorerReport_items[]
}

function toBackgroundColors(report: BookamkerExplorerReportQuery_bookmakerExplorerReport_items[]) {
  const firstReport = head(report)

  if (firstReport?.diffStatus === 0) {
    return 'red'
  }

  return 'green'
}

function reportDataToChartData(report: BookamkerExplorerReportQuery_bookmakerExplorerReport_items[]) {
  const firstReport = head(report)

  return {
    x: firstReport?.intervalKey + '%' ?? '-',
    y: firstReport?.bookmakerOccuracyPercent ?? 0,
  }
}

function toDataByIntevals(reportList: BookamkerExplorerReportQuery_bookmakerExplorerReport_items[]): IData {
  const groupedByInterval = groupBy(reportList, 'intervalKey')

  return {
    chartData: {
      backgroundColors: map(groupedByInterval, toBackgroundColors),
      data: map(groupedByInterval, reportDataToChartData),
    },
    tableData: map(groupedByInterval, head) as BookamkerExplorerReportQuery_bookmakerExplorerReport_items[],
  }
}

interface IBetPaneProps {
  reports: BookamkerExplorerReportQuery_bookmakerExplorerReport_items[]
  bet: string
  betLabelId: number
  periodType: string
  periodValue: string
}

const BetPane: React.FunctionComponent<IBetPaneProps> = (props) => {
  const data = toDataByIntevals(props.reports)

  const columns = [
    {
      title: 'Interval',
      dataIndex: 'intervalKey',
      key: 'intervalKey',
      render: (value: string) => {
        const link =
          routes.bookmakerExplorerIntervalReportPage +
          '?intervalKey=' +
          value +
          '&bet=' +
          props.bet +
          '&betLabelId=' +
          props.betLabelId +
          '&periodType=' +
          props.periodType +
          '&periodValue=' +
          props.periodValue

        return <Link to={link}>{value}</Link>
      },
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

  const chartDatasets = [
    {
      backgroundColor: data.chartData.backgroundColors ?? 'rgb(52, 152, 219)',
      data: data.chartData.data,
      fill: false,
      steppedLine: true,
      showLine: false,
    },
    {
      data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      type: 'line',
      fill: false,
    },
    {
      data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
      type: 'line',
      fill: false,
    },
  ]

  const labels = data.chartData.data.map((item) => item.x)

  return (
    <Container>
      <Container height={300}>
        <LineChart labels={labels} datasets={chartDatasets} />
      </Container>
      <Container>
        <Table pagination={false} size="small" columns={columns} dataSource={data.tableData} />
      </Container>
    </Container>
  )
}

interface IProps {
  betLabelId: BetLabelIdEnum
  period: {
    year: number
    yearMonth?: number
    monthDay?: number
    yearWeek?: number
  }
  bet: string
  onTabChange: (tab: string) => void
  periodType: ReportPeriodEnum
}

const BetLabelPane: React.FunctionComponent<IProps> = (props) => {
  const [periodType] = useUrlParamState('periodType')
  const [periodValue] = useUrlParamState('periodValue')
  const reportQueryRes = useQuery<BookamkerExplorerReportQuery, BookamkerExplorerReportQueryVariables>(reportQuery, {
    variables: {
      args: {
        betLabelId: props.betLabelId,
        year: props.period.year,
        yearMonth: props.period.yearMonth,
        monthDay: props.period.monthDay,
        yearWeek: props.period.yearWeek,
        periodType: props.periodType,
      },
    },
  })

  const betLabel = find(BetLabels, (item) => {
    return item.apiFootballLabelId === props.betLabelId
  })

  const reports = reportQueryRes.data?.bookmakerExplorerReport?.items ?? []

  const groupedByBet = groupBy(reports, 'bet')

  const availableBetLabel = find(
    bookmakerExplorerLabels,
    (bookmakerExplorerLabelsItem) => bookmakerExplorerLabelsItem.apiFootballLabelId === props.betLabelId,
  )

  if (!periodType || !periodValue) {
    return null
  }

  return (
    <Tabs destroyInactiveTabPane activeKey={props.bet} onChange={props.onTabChange}>
      {map(betLabel?.values ?? {}, (value, key) => {
        const availableBetList: string[] = map(
          availableBetLabel?.values ?? [],
          (availableBetLabelItem) => availableBetLabelItem,
        )

        if (availableBetList.includes(value)) {
          return (
            <TabPane tab={key} key={key}>
              <BetPane
                periodType={periodType}
                periodValue={periodValue}
                bet={key}
                betLabelId={props.betLabelId}
                reports={groupedByBet[value]}
              />
            </TabPane>
          )
        }

        return null
      })}
    </Tabs>
  )
}

export default BetLabelPane
