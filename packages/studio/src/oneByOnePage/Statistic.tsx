import React, { useMemo } from 'react'
import { sumBy, round } from 'lodash'
import { IPick } from '@gepick/components/pick/Pick'
import Container from '@gepick/components/container/Container'
import { PickStatusEnum } from '@gepick/database/src/types'

interface IProps {
  picks: IPick[]
}

const Statistic: React.FunctionComponent<IProps> = (props) => {
  const stat = useMemo(() => {
    const count = (f: (pick: IPick) => boolean) => {
      const res = props.picks.filter(f)
      return res.length
    }

    return {
      totalPicks: props.picks.length,
      totalCorrect: count((pick) => pick.status === PickStatusEnum.CORRECT),
      totalProfit: round(sumBy(props.picks, 'profit'), 2),
    }
  }, [props.picks])

  return (
    <Container flex>
      <Container>Total picks: {stat.totalPicks}</Container>
      <Container width={5} />
      <Container>Total correct: {stat.totalCorrect}</Container>
      <Container width={5} />
      <Container>Total profit: {stat.totalProfit}</Container>
    </Container>
  )
}

export default Statistic
