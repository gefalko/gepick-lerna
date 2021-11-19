import React from 'react'
import { Table } from 'antd'
import { ZoomInOutlined } from '@ant-design/icons'
import Container from '@gepick/components/container/Container'
import routes from 'routes/routes'
import Link from '@gepick/components/link/Link'
import usePredictionsExplorerModal from './predictionsExplorer/usePredictionsExplorerModal'

interface ITableDataItem {
  intervalKey: string
  totalPredictions: number
}

interface IProps {
  tableData: ITableDataItem[]
  dayFrom: string
  dayTo: string
  botDockerImage: string
  betLabelId: number
  bet: string
  loading: boolean
}

const turnOfIntervalLink = true

const ReportTable: React.FunctionComponent<IProps> = (props) => {
  const [openPredictionsExplorerModal, predictionsModal] = usePredictionsExplorerModal()

  const columns = [
    {
      title: 'Actions',
      dataIndex: 'intervalKey',
      key: 'intervalKey',
      render: (intervalKey: string) => {
        const handlePredictionsExplorerClick = () => {
          openPredictionsExplorerModal({
            intervalKey,
            dayFrom: props.dayFrom,
            dayTo: props.dayTo,
            botDockerImage: props.botDockerImage,
            betLabelId: props.betLabelId,
            bet: props.bet,
          })
        }

        return (
          <Container cursor="pointer" onClick={handlePredictionsExplorerClick}>
            <ZoomInOutlined />
          </Container>
        )
      },
    },
    {
      title: 'Interval',
      dataIndex: 'intervalKey',
      key: 'intervalKey',
      render: (value: string) => {
        if (turnOfIntervalLink) {
          return value
        }

        const href = `${routes.botExplorerIntervalPage}?interval=${value}`
        return <Link href={href}>{value}</Link>
      },
    },
    {
      title: 'Total',
      dataIndex: 'totalPredictions',
      key: 'totalPredictions',
    },
    {
      title: 'Total with result',
      dataIndex: 'totalPredictionsWithResult',
      key: 'totalPredictionsWithResult',
    },
    {
      title: 'Total correct',
      dataIndex: 'totalCorrect',
      key: 'totalCorrect',
    },
    {
      title: 'Total not correct',
      dataIndex: 'totalNotCorrect',
      key: 'totalNotCorrect',
    },
    {
      title: 'Correct percent',
      dataIndex: 'correctPercent',
      key: 'correctPercent',
      render: (item: number) => `${item}%`,
    },
  ]

  return (
    <Container>
      <Table loading={props.loading} pagination={false} size="small" columns={columns} dataSource={props.tableData} />
      {predictionsModal}
    </Container>
  )
}

export default ReportTable
