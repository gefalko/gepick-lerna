import React from 'react'
import moment from 'moment'
import { sumBy, map, round } from 'lodash'
import brandBook from '@gepick/assets/styles/brandBook'
import ProfitBarChart, { IPayload } from './ProfitBarChart'
import Container from '../container/Container'
import Card from '../card/Card'

type Bet = 'home' | 'draw' | 'away' | 'under' | 'over'

interface IReport {
  report: {
    profit: number
    total: number
    totalCorrect: number
    totalWrong: number
    totalCanceled: number
    totalPending: number
    accuracy?: number | null
  }
}

interface IReports {
  day: string
  home: IReport | null
  draw: IReport | null
  away: IReport | null
  under: IReport | null
  over: IReport | null
}

function formatReport(report: IReports, bet: Bet) {
  const betReport = report[bet]?.report

  if (!betReport) {
    return null
  }

  return {
    day: moment(report.day).format('YYYY-MM-DD'),
    profit: betReport.profit,
    total: betReport.total,
    totalCorrect: betReport.totalCorrect,
    totalWrong: betReport.totalWrong,
    accuracy: betReport.accuracy,
    totalCanceled: betReport.totalCanceled,
    totalPending: betReport.totalPending,
  }
}

interface IProps {
  reports: IReports[]
  onBarClick: (day: string, bet: Bet) => void
}

const ProfitBarCharts: React.FunctionComponent<IProps> = (props) => {
  const renderChart = (bet: Bet) => {
    const profitChartData = props.reports.map((report) => {
      return formatReport(report, bet)
    })

    const sum = (key: string) => {
      return round(sumBy(profitChartData, key), 2)
    }

    const overallTotal = sum('total')
    const overallProfit = sum('profit')

    const overall = {
      Profit: overallProfit,
      Total: overallTotal,
      Correct: sum('totalCorrect'),
      Wrong: sum('totalWrong'),
      Canceled: sum('totalCanceled'),
      Pending: sum('totalPending'),
      ROI: overallTotal ? round(overallProfit / overallTotal, 2) : 0,
    }

    const handleBarClick = (payload: IPayload) => {
      props.onBarClick(payload.day, bet)
    }

    return (
      <Card>
        <Container style={brandBook.h3} marginBottom={20}>
          {bet}
        </Container>
        <Container flex noWrap>
          <Container marginRight={10}>
            <Container marginBottom={10}>Days Overall</Container>
            {map(overall, (value, key) => {
              return (
                <Container flex width={90} justifyContentSpaceBetween>
                  <Container>{key}</Container>
                  <Container>{value}</Container>
                </Container>
              )
            })}
          </Container>
          <Container width="100%">
            <ProfitBarChart onBarClick={handleBarClick} data={profitChartData ?? []} />
          </Container>
        </Container>
      </Card>
    )
  }

  return (
    <Container justifyContentCenter>
      {renderChart('home')}
      {renderChart('draw')}
      {renderChart('away')}
      {renderChart('under')}
      {renderChart('over')}
    </Container>
  )
}

export default ProfitBarCharts
