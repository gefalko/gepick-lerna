import React, { useMemo, ReactNode } from 'react'
import { map } from 'lodash'
import { Select } from 'antd'
import Container from '@gepick/components/container/Container'
import useUrlParamState from '@gepick/components/hooks/useUrlParamState'
import { BetLabels, getBetLabelByLabelId, BetLabelIdEnum } from '@gepick/utils/src/BetLabels'

const betLabelSelectStyle = { width: '60%' }
const betSelectStyle = { width: '40%' }

function useBetSelect(): [number, string, ReactNode] {
  const [betLabelId, setBetLabelId] = useUrlParamState('betLabel', '1')
  const [bet, setBet] = useUrlParamState('bet', 'Home')

  const selectBetComponent = useMemo(() => {
    if (!betLabelId || !bet) {
      return null
    }

    const activeBetLabel = getBetLabelByLabelId(parseInt(betLabelId, 10) as BetLabelIdEnum)

    if (!activeBetLabel) {
      return null
    }

    const handleBetLabelChange = (newBetlabelId: string) => {
      const newBetLabel = getBetLabelByLabelId(parseInt(newBetlabelId, 10) as BetLabelIdEnum)

      setBetLabelId(newBetlabelId)

      if (newBetLabel) {
        const { values } = newBetLabel
        setBet(values[Object.keys(values)[0]])
      }
    }

    return (
      <Container>
        <Select
          style={betLabelSelectStyle}
          value={activeBetLabel.apiFootballLabelId.toString()}
          onChange={handleBetLabelChange}
        >
          {map(BetLabels, (BetLabelsItem) => {
            return (
              <Select.Option value={BetLabelsItem.apiFootballLabelId.toString()}>{BetLabelsItem.name}</Select.Option>
            )
          })}
        </Select>
        <Select style={betSelectStyle} value={bet} onChange={setBet}>
          {map(activeBetLabel?.values, (valuesItem) => {
            return <Select.Option value={valuesItem}>{valuesItem}</Select.Option>
          })}
        </Select>
      </Container>
    )
  }, [betLabelId, bet, setBet, setBetLabelId])

  if (betLabelId == null || !bet) {
    throw new Error('Bet label or bet is undefined')
  }

  return [parseInt(betLabelId, 10), bet, selectBetComponent]
}

export default useBetSelect
