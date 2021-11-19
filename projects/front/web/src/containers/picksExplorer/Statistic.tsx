import React, { useMemo } from 'react'
import Card from 'components/card/Card'
import styled from 'styled-components'
import { colors } from '@gepick/assets/styles/cssVariables'
import useBreakPoints from '@gepick/components/hooks/useBreakPoints'
import { PicksExplorerPagePicksQuery_picksExplorerPagePicks_statistic } from '../../generatedGraphqlTypes'

const StyledTable = styled.table`
  th,
  td {
    padding: 5px;
  }
`

interface IProps {
  statistic: PicksExplorerPagePicksQuery_picksExplorerPagePicks_statistic
}

const Statistic: React.FunctionComponent<IProps> = (props) => {
  const { total, totalFinished, totalCorrect, totalNotCorrect, totalProfit, profitPerPick } = props.statistic
  const { isMobile } = useBreakPoints()

  const desktopTable = useMemo(() => {
    return (
      <StyledTable>
        <tr>
          <th>Total</th>
          <th>Finished</th>
          <th>Correct</th>
          <th>Not correct</th>
          <th>Profit</th>
          <th>Profit per pick</th>
        </tr>
        <tr>
          <td>{total}</td>
          <td>{totalFinished}</td>
          <td>{totalCorrect}</td>
          <td>{totalNotCorrect}</td>
          <td>{totalProfit > 0 ? '+' + totalProfit : totalProfit} </td>
          <td>{profitPerPick > 0 ? '+' + profitPerPick : profitPerPick}</td>
        </tr>
      </StyledTable>
    )
  }, [total, totalFinished, totalCorrect, totalNotCorrect, totalProfit, profitPerPick])

  const mobileTable = useMemo(() => {
    return (
      <StyledTable>
        <tr>
          <th>Total</th>
          <td>{total}</td>
        </tr>
        <tr>
          <th>Total finished</th>
          <td>{totalFinished}</td>
        </tr>
        <tr>
          <th>Correct</th>
          <td>{totalCorrect}</td>
        </tr>
        <tr>
          <th>Not correct</th>
          <td>{totalNotCorrect}</td>
        </tr>
        <tr>
          <th>Profit</th>
          <td>{totalProfit > 0 ? '+' + totalProfit : totalProfit} </td>
        </tr>
        <tr>
          <th>Profit per pick</th>
          <td>{profitPerPick > 0 ? '+' + profitPerPick : profitPerPick}</td>
        </tr>
      </StyledTable>
    )
  }, [total, totalFinished, totalCorrect, totalNotCorrect, totalProfit, profitPerPick])

  return (
    <Card noJustifyContentCenter color={props.statistic.totalProfit > 0 ? colors.green : colors.red}>
      {isMobile && mobileTable}
      {!isMobile && desktopTable}
    </Card>
  )
}

export default Statistic
