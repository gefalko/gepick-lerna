import React, { useMemo } from 'react'
import Container from '@gepick/components/container/Container'
import {
  BotExplorerReportQuery_botExplorerReport_reports,
  BotExplorerReportQuery_botExplorerReport_overallStatistic,
} from 'generatedGraphqlTypes'
import { Table } from 'antd'
import Link from '@gepick/components/link/Link'
import routes from 'routes/routes'
import { ISettings } from './SettingsSideBar'

interface IProps {
  data: BotExplorerReportQuery_botExplorerReport_reports[]
  overallReport: BotExplorerReportQuery_botExplorerReport_overallStatistic
  settings: ISettings
}

interface IGenerateDayLinkProps {
  day: string
  settings: ISettings
}

function generateDayLink(args: IGenerateDayLinkProps) {
  const {
    probabilityFrom,
    probabilityTo,
    betLabelId,
    bet,
    botDockerImage,
    valueFrom,
    valueTo,
    oddProbabilityFrom,
    oddProbabilityTo,
  } = args.settings

  return `${routes.picksExplorerPage}?day=${args.day}&probabilityFrom=${probabilityFrom}&probabilityTo=${probabilityTo}&betLabel=${betLabelId}&bet=${bet}&botDockerImage=${botDockerImage}&valueFrom=${valueFrom}&valueTo=${valueTo}&oddProbabilityFrom=${oddProbabilityFrom}&oddProbabilityTo=${oddProbabilityTo}`
}

const ReportTable: React.FunctionComponent<IProps> = (props) => {
  const formatedDatasource = useMemo(() => {
    const data = props.data.map((dataItem) => {
      return {
        day: dataItem.day,
        total: dataItem.statistic.total,
        totalFinished: dataItem.statistic.totalFinished,
        totalCorrect: dataItem.statistic.totalCorrect,
        totalNotCorrect: dataItem.statistic.totalNotCorrect,
        totalProfit: dataItem.statistic.totalProfit,
        profitPerPick: dataItem.statistic.profitPerPick,
      }
    })

    return data
  }, [props.data])

  const lastRow = useMemo(() => {
    return {
      day: undefined,
      total: props.overallReport.total,
      totalFinished: props.overallReport.totalFinished,
      totalCorrect: props.overallReport.totalCorrect,
      totalNotCorrect: props.overallReport.totalNotCorrect,
      totalProfit: props.overallReport.totalProfit,
      profitPerPick: props.overallReport.profitPerPick,
    }
  }, [props.overallReport])

  formatedDatasource.push(lastRow as any)

  const columns = useMemo(() => {
    return [
      {
        title: 'Day',
        dataIndex: 'day',
        key: 'day',
        render: (day?: string) => {
          if (!day) {
            return 'All days'
          }

          const link = generateDayLink({ day, settings: props.settings })

          return (
            <Link targetBlank href={link}>
              {day}
            </Link>
          )
        },
      },
      {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
      },
      {
        title: 'Finished',
        dataIndex: 'totalFinished',
        key: 'totalFinished',
      },
      {
        title: 'Correct',
        dataIndex: 'totalCorrect',
        key: 'totalCorrect',
      },
      {
        title: 'Not correct',
        dataIndex: 'totalNotCorrect',
        key: 'totalNotCorrect',
      },
      {
        title: 'Profit',
        dataIndex: 'totalProfit',
        key: 'totalProfit',
      },
      {
        title: 'Profit per pick',
        dataIndex: 'profitPerPick',
        key: 'profitPerPick',
      },
    ]
  }, [props.settings])

  return (
    <Container>
      <Table pagination={false} columns={columns} dataSource={formatedDatasource} />
    </Container>
  )
}

export default ReportTable
