import React from 'react'
import { Table } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'
import Container from '@gepick/components/container/Container'
import moment from 'moment'

const cryptoStrategyBackTestQuery = gql`
  query CryptoStrategyBackTestQuery {
    cryptoStrategyBackTest {
      strategyTitle
      startTime
      endTime
      totalTrades
      winTrades
      lostTrades
      winTradesPercent
      profit
    }
  }
`

const columns = [
  {
    title: 'strategyTitle',
    dataIndex: 'strategyTitle',
    key: 'strategyTitle',
  },
  {
    title: 'startTime',
    dataIndex: 'startTime',
    key: 'startTime',
    render: (time: number) => {
      return moment(time).format('YYYY-MM-DD HH:mm')
    },
  },
  {
    title: 'closeTime',
    dataIndex: 'closeTime',
    key: 'closeTime',
    render: (time: number) => {
      return moment(time).format('YYYY-MM-DD HH:mm')
    },
  },
  {
    title: 'totalTrades',
    dataIndex: 'totalTrades',
    key: 'totalTrades',
  },
  {
    title: 'winTrades',
    dataIndex: 'winTrades',
    key: 'winTrades',
  },
  {
    title: 'lostTrades',
    dataIndex: 'lostTrades',
    key: 'lostTrades',
  },
  {
    title: 'winTradesPercent',
    dataIndex: 'winTradesPercent',
    key: 'winTradesPercent',
  },
  {
    title: 'profit',
    dataIndex: 'profit',
    key: 'profit',
  },
]

const CryptoStrategyBackTestPage = () => {
  const cryptoStrategyBackTestRes = useQuery(cryptoStrategyBackTestQuery)

  const dataSource = cryptoStrategyBackTestRes.data?.cryptoStrategyBackTest ?? []

  return (
    <Container>
      <Table sticky={{ offsetHeader: 50 }} pagination={false} dataSource={dataSource} columns={columns} />
    </Container>
  )
}

export default CryptoStrategyBackTestPage
