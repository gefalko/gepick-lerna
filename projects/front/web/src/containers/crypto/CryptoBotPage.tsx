import React from 'react'
import moment from 'moment'
import { Table } from 'antd'
import gql from 'graphql-tag'
import Container from '@gepick/components/container/Container'
import { useQuery } from 'react-apollo-hooks'

const cryptoKlinesQuery = gql`
  query CryptoKlinesQuery {
    cryptoKlines {
      openTime
      openPrice
      priceChange
      highPrice
      lowPrice
      closePrice
      trueRange
      averageTrueRange
      volume
      assetVolume
      totalTrades
      heikinAshiOpenPrice
      heikinAshiClosePrice
      heikinAshiHighPrice
      heikinAshiLowPrice
      heikinAshiKandleBodySize
      isHeikinAshiDojiCandle
      heikinAshiTrendDirection
      sma10heikinAshi
      sma30heikinAshi
      ema10heikinAshi
      ema30heikinAshi
      sma10
      sma30
      ema10
      ema30
      isGreenCandle
      isRedCandle
      last30totalGreenCandle
      last30totalRedCandle
      ema30minusEma10
    }
  }
`

const columns = [
  {
    title: 'openTime',
    dataIndex: 'openTime',
    key: 'openTime',
    width: 80,
    render: (time: number) => {
      return moment(time).format('YYYY-MM-DD HH:mm')
    },
  },
  {
    title: 'isGreenCandle',
    dataIndex: 'isGreenCandle',
    width: 80,
    key: 'isGreenCandle',
    render: (value: boolean) => {
      return value ? <Container style={{ backgroundColor: 'green' }}>'true'</Container> : 'false'
    },
  },
  {
    title: 'isRedCandle',
    dataIndex: 'isRedCandle',
    width: 80,
    key: 'isRedCandle',
    render: (value: boolean) => {
      return value ? <Container style={{ backgroundColor: 'green' }}>'true'</Container> : 'false'
    },
  },
  {
    title: 'ema30minusEma10',
    dataIndex: 'ema30minusEma10',
    width: 80,
    key: 'ema30minusEma10',
  },
  {
    title: 'last30totalGreenCandle',
    dataIndex: 'last30totalGreenCandle',
    key: 'last30totalGreenCandle',
    width: 80,
  },
  {
    title: 'last30totalRedCandle',
    dataIndex: 'last30totalRedCandle',
    key: 'last30totalRedCandle',
    width: 80,
  },
  {
    title: 'ema10',
    dataIndex: 'ema10',
    key: 'ema10',
    width: 80,
  },
  {
    title: 'ema30',
    dataIndex: 'ema30',
    key: 'ema30',
    width: 80,
  },
  {
    title: 'volume',
    dataIndex: 'volume',
    key: 'volume',
    width: 80,
  },
  {
    title: 'averageTrueRange',
    dataIndex: 'averageTrueRange',
    key: 'averageTrueRange',
    width: 80,
  },

  {
    title: 'totalTrades',
    dataIndex: 'totalTrades',
    key: 'totalTrades',
    width: 80,
  },
  {
    title: 'openPrice',
    dataIndex: 'openPrice',
    width: 80,
    key: 'openPrice',
  },
  {
    title: 'closePrice',
    dataIndex: 'closePrice',
    width: 80,
    key: 'closePrice',
  },
  {
    title: 'highPrice',
    dataIndex: 'highPrice',
    width: 80,
    key: 'highPrice',
  },
  {
    title: 'lowPrice',
    dataIndex: 'lowPrice',
    width: 80,
    key: 'lowPrice',
  },
  {
    title: 'priceChange',
    dataIndex: 'priceChange',
    width: 80,
    key: 'priceChange',
  },
  {
    title: 'heikinAshiOpenPrice',
    dataIndex: 'heikinAshiOpenPrice',
    key: 'heikinAshiOpenPrice',
    width: 80,
  },
  {
    title: 'heikinAshiClosePrice',
    dataIndex: 'heikinAshiClosePrice',
    key: 'heikinAshiClosePrice',
    width: 80,
  },
  {
    title: 'heikinAshiHighPrice',
    dataIndex: 'heikinAshiHighPrice',
    key: 'heikinAshiHighPrice',
    width: 80,
  },
  {
    title: 'heikinAshiLowPrice',
    dataIndex: 'heikinAshiLowPrice',
    key: 'heikinAshiLowPrice',
    width: 80,
  },
  {
    title: 'heikinAshiKandleBodySize',
    dataIndex: 'heikinAshiKandleBodySize',
    key: 'heikinAshiKandleBodySize',
    width: 80,
  },
  {
    title: 'IHADC',
    dataIndex: 'isHeikinAshiDojiCandle',
    key: 'isHeikinAshiDojiCandle',
    render: (value: boolean) => {
      return value ? <Container style={{ backgroundColor: 'green' }}>'true'</Container> : 'false'
    },
    width: 80,
  },
  {
    title: 'HATD',
    dataIndex: 'heikinAshiTrendDirection',
    key: 'heikinAshiTrendDirection',
    width: 80,
  },
  {
    title: 'assetVolume',
    dataIndex: 'assetVolume',
    key: 'assetVolume',
    width: 80,
  },
  {
    title: 'trueRange',
    dataIndex: 'trueRange',
    key: 'trueRange',
    width: 80,
  },
  {
    title: 'sma10heikinAshi',
    dataIndex: 'sma10heikinAshi',
    key: 'sma10heikinAshi',
    width: 80,
  },
  {
    title: 'sma30heikinAshi',
    dataIndex: 'sma30heikinAshi',
    key: 'sma30heikinAshi',
    width: 80,
  },
  {
    title: 'ema10heikinAshi',
    dataIndex: 'ema10heikinAshi',
    key: 'ema10heikinAshi',
    width: 80,
  },
  {
    title: 'ema30heikinAshi',
    dataIndex: 'ema30heikinAshi',
    key: 'ema30heikinAshi',
    width: 80,
  },
  {
    title: 'sma10',
    dataIndex: 'sma10',
    key: 'sma10',
    width: 80,
  },
  {
    title: 'sma30',
    dataIndex: 'sma30',
    key: 'sma30',
    width: 80,
  },
]

// const strategy = 'https://www.youtube.com/watch?v=cR2fNvgw-XQ'

const CryptoBotPage = () => {
  const cryptoKlinesQueryRes = useQuery(cryptoKlinesQuery)

  const dataSource = cryptoKlinesQueryRes.data?.cryptoKlines ?? []

  console.log(cryptoKlinesQueryRes)

  return (
    <Container>
      <Table size="small" pagination={false} dataSource={dataSource} columns={columns} />
    </Container>
  )
}

export default CryptoBotPage
