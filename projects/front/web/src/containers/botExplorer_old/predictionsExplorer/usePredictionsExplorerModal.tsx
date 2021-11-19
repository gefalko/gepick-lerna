import React, { useState, ReactNode } from 'react'
import { Modal, Spin } from 'antd'
import gql from 'graphql-tag'
import styled from 'styled-components'
import { useQuery } from 'react-apollo-hooks'
import Container from '@gepick/components/container/Container'
import PredictionExplorerPick from './PredictionsExplorerPick'
import PredictionExplorerStatistic from './PredictionExplorerStatistic'
import { BotIntervalPredictionsQuery, BotIntervalPredictionsQueryVariables } from '../../../generatedGraphqlTypes'

const StyledContainer = styled(Container)`
  overflow: scroll;
  height: 70vh;
`

const cancelButtonProps = {
  style: {
    display: 'none',
  },
}

const botIntervalPredictionsQuery = gql`
  query BotIntervalPredictionsQuery($args: BotIntervalPredictionsInput!) {
    botIntervalPredictions(args: $args) {
      statistic {
        total
        totalWithResultAndOdd
        totalCorrect
        totalNotCorrect
        totalProfit
        profitPerPick
        roi
      }
      picks {
        match {
          homeTeamName
          awayTeamName
          goalsHomeTeam
          goalsAwayTeam
        }
        profit
        oddSize
        bookmakerName
        isPickWin
      }
    }
  }
`

interface IData {
  intervalKey: string
  dayFrom: string
  dayTo: string
  botDockerImage: string
  betLabelId: number
  bet: string
}

function usePredictionsExplorerModal(): [(data?: IData) => void, ReactNode] {
  const [data, setData] = useState<IData>()

  const botIntervalPredictionsQueryRes = useQuery<BotIntervalPredictionsQuery, BotIntervalPredictionsQueryVariables>(
    botIntervalPredictionsQuery,
    {
      variables: {
        args: {
          intervalKey: data?.intervalKey ?? '',
          dayFrom: data?.dayFrom ?? '',
          dayTo: data?.dayTo ?? '',
          botDockerImage: data?.botDockerImage ?? '',
          betLabelId: data?.betLabelId ?? 0,
          bet: data?.bet ?? '',
        },
      },
      skip: !data,
    },
  )

  const picks = botIntervalPredictionsQueryRes.data?.botIntervalPredictions.picks ?? []
  const statitstic = botIntervalPredictionsQueryRes.data?.botIntervalPredictions.statistic

  const closeModal = () => {
    setData(() => {
      return undefined
    })
  }

  const predictionsModal = (
    <Modal
      title="Bot predictions"
      cancelButtonProps={cancelButtonProps}
      onCancel={closeModal}
      onOk={closeModal}
      visible={data != null}
    >
      <StyledContainer>
        <Container justifyContentCenter>{botIntervalPredictionsQueryRes.loading && <Spin />}</Container>

        {statitstic && <PredictionExplorerStatistic statistic={statitstic} />}
        {picks.map((pick) => (
          <PredictionExplorerPick pick={pick} />
        ))}
      </StyledContainer>
    </Modal>
  )

  return [setData, predictionsModal]
}

export default usePredictionsExplorerModal
