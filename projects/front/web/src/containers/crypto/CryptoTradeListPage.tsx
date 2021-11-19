import React from 'react'
import { Table } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'
import { sumBy } from 'lodash'
import Container from '@gepick/components/container/Container'
import moment from 'moment'

const cryptoStrategyTradeListQuery = gql`
  query CryptoStrategyTradeListQuery {
    cryptoStrategyTradeList {
      openTime
      closeTime
      openPrice
      closePrice
      profit
      flatProfit
      status
      tradeType
      tradeSum
      tradeSumAfterFee
      sumAfterTrade
    }
  }
`

const columns = [
  {
    title: 'openTime',
    dataIndex: 'openTime',
    key: 'openTime',
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
    title: 'openPrice',
    dataIndex: 'openPrice',
    key: 'openPrice',
  },
  {
    title: 'closePrice',
    dataIndex: 'closePrice',
    key: 'closePrice',
  },
  {
    title: 'profit',
    dataIndex: 'profit',
    key: 'profit',
  },
  {
    title: 'tradeSum',
    dataIndex: 'tradeSum',
    key: 'tradeSum',
  },
  {
    title: 'tradeSumAfterFee',
    dataIndex: 'tradeSumAfterFee',
    key: 'tradeSumAfterFee',
  },
  {
    title: 'sumAfterTrade',
    dataIndex: 'sumAfterTrade',
    key: 'sumAfterTrade',
  },
  {
    title: 'status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'tradeType',
    dataIndex: 'tradeType',
    key: 'tradeType',
  },
  {
    title: 'profit',
    dataIndex: 'profit',
    key: 'profit',
  },
  {
    title: 'flatProfit',
    dataIndex: 'flatProfit',
    key: 'flatProfit',
  },
]

const CryptoTradeListPage = () => {
  const cryptoStrategyTradeListRes = useQuery(cryptoStrategyTradeListQuery)

  const dataSource = cryptoStrategyTradeListRes.data?.cryptoStrategyTradeList ?? []

  return (
    <Container>
      <Container> {sumBy(dataSource, 'flatProfit')}</Container>
      <Table pagination={false} dataSource={dataSource} columns={columns} />
    </Container>
  )
}

export default CryptoTradeListPage
