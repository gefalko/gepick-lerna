import React, { useCallback } from 'react'
import styled from 'styled-components'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import Container from '../container/Container'
import Dimensions from '../dimensions/Dimensions'

const StyledContainer = styled(Container)`
  .recharts-bar {
    cursor: pointer;
  }
`

const StyledTooltipContainer = styled(Container)`
  background-color: #fff;
  padding: 5px;
  border-radius: 4px;
`

export interface IPayload {
  profit: number
  total: number
  totalCorrect: number
  totalPending: number
  totalCanceled: number
  totalWrong: number
  accuracy?: number
  day: string
}

interface IPayloadData {
  payload: IPayload
}

interface ITooltipProps {
  active?: boolean
  payload?: IPayloadData[]
}

const CustomTooltip = (props: ITooltipProps) => {
  if (props.active && props.payload && props.payload[0]) {
    const { payload } = props.payload[0]
    const { profit } = payload
    return (
      <StyledTooltipContainer>
        <Container>{`Day : ${payload.day}`}</Container>
        <Container style={{ color: profit < 0 ? 'red' : 'green' }}>{`Profit : ${profit}`}</Container>
        <Container>{`Total : ${payload.total}`}</Container>
        <Container>{`Total correct : ${payload.totalCorrect}`}</Container>
        <Container>{`Total wrong : ${payload.totalWrong}`}</Container>
        <Container>{`Total canceled : ${payload.totalCanceled}`}</Container>
        <Container>{`Total pending : ${payload.totalPending}`}</Container>
        <Container>{`Accuracy : ${payload.accuracy}`}%</Container>
      </StyledTooltipContainer>
    )
  }

  return null
}

interface IProps {
  data: any[] // eslint-disable-line
  onBarClick: (payload: IPayload) => void
}

const ProfitBarChart: React.FunctionComponent<IProps> = (props) => {
  const { onBarClick } = props

  const handleClick = useCallback(
    (barProps: { payload: IPayload }) => {
      onBarClick(barProps.payload)
    },
    [onBarClick],
  )

  return (
    <Dimensions>
      {(width) => {
        const chartWidth = width < 600 ? width : 600
        return (
          <StyledContainer>
            <BarChart
              width={chartWidth}
              height={chartWidth / 1.5}
              data={props.data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar onClick={handleClick} dataKey="profit" fill="#3498db" />
            </BarChart>
          </StyledContainer>
        )
      }}
    </Dimensions>
  )
}

export default ProfitBarChart
