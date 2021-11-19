import React from 'react'
import Container from '@gepick/components/container/Container'
import { BotIntervalPredictionsQuery_botIntervalPredictions_statistic } from '../../../generatedGraphqlTypes'

interface IProps {
  statistic: BotIntervalPredictionsQuery_botIntervalPredictions_statistic
}

interface IItemProps {
  label: string
  value: string | number
}

const Item: React.FunctionComponent<IItemProps> = (props) => {
  return (
    <Container>
      <Container>{props.label}</Container>
      <Container>{props.value}</Container>
    </Container>
  )
}

const PredictionExplorerStatistic: React.FunctionComponent<IProps> = (props) => {
  const {
    total,
    totalWithResultAndOdd,
    totalCorrect,
    totalNotCorrect,
    totalProfit,
    profitPerPick,
    roi,
  } = props.statistic

  return (
    <Container>
      <Item label="Total" value={total} />
      <Item label="Total with result and odd" value={totalWithResultAndOdd} />
      <Item label="Total correct" value={totalCorrect} />
      <Item label="Total not correct" value={totalNotCorrect} />
      <Item label="Total profit" value={totalProfit} />
      <Item label="Profit per pick" value={profitPerPick} />
      <Item label="ROI" value={roi} />
    </Container>
  )
}

export default PredictionExplorerStatistic
