import React, { useMemo, useCallback } from 'react'
import { Tabs } from 'antd'
import Container from '@gepick/components/container/Container'
import PageTitle from 'components/pageTitle/PageTitle'
import { usePeriodSelector, PeriodTypeEnum } from '@gepick/components/periodSelector/PeriodSelector'
import { formatedYestardayDate, formatedLastWeek } from '@gepick/utils/src/dates'
import Breadcrumb from '@gepick/components/breadcrumb/Breadcrumb'
import useUrlParamState from '@gepick/components/hooks/useUrlParamState'
import { getBetLabelByLabelId, BetLabels } from '@gepick/utils/src/BetLabels'
import BetLabelPane from './BetLabelPane'
import { ReportPeriodEnum } from '../../generatedGraphqlTypes'

const { TabPane } = Tabs

const BookmakerExplorerPage = () => {
  const { selectedPeriodType, period, periodSelectorComponent } = usePeriodSelector({
    defaultDay: formatedYestardayDate(),
    defaultWeek: formatedLastWeek(),
  })
  const [betLabelId, setBetLabelId] = useUrlParamState(
    'betLabelId',
    BetLabels.MatchWinner.apiFootballLabelId.toString(),
  )
  const [bet, setBet] = useUrlParamState('bet', 'Home')

  const betLabel = betLabelId ? getBetLabelByLabelId(parseInt(betLabelId, 10)) : undefined

  const reportPeriodType = useMemo(() => {
    if (selectedPeriodType === PeriodTypeEnum.WEEKLY) {
      return ReportPeriodEnum.WEEK
    }

    return ReportPeriodEnum.DAY
  }, [selectedPeriodType])

  const handleBetLabelTabChange = useCallback(
    (key) => {
      setBetLabelId(key)

      const newBetLabel = getBetLabelByLabelId(parseInt(key, 10))
      if (newBetLabel) {
        const [defaultBet] = Object.keys(newBetLabel?.values)
        setBet(defaultBet)
      }
    },
    [setBet, setBetLabelId],
  )

  const handleBetPaneTabChange = (tab: string) => {
    setBet(tab)
  }

  if (!bet) {
    return null
  }

  return (
    <Container margin={20}>
      <PageTitle pageTitle="Bookmaker explorer" />
      <Container>
        <Breadcrumb title={`${betLabel?.name} - ${bet}`} />
      </Container>
      <hr />
      <Container>{periodSelectorComponent}</Container>
      <Tabs destroyInactiveTabPane onChange={handleBetLabelTabChange} activeKey={betLabelId ?? '1'}>
        <TabPane destroyInactiveTabPane tab={BetLabels.MatchWinner.name} key={BetLabels.MatchWinner.apiFootballLabelId}>
          <BetLabelPane
            onTabChange={handleBetPaneTabChange}
            bet={bet}
            periodType={reportPeriodType}
            period={period}
            betLabelId={BetLabels.MatchWinner.apiFootballLabelId}
          />
        </TabPane>
        <TabPane
          destroyInactiveTabPane
          tab={BetLabels.GoalsOverUnder.name}
          key={BetLabels.GoalsOverUnder.apiFootballLabelId}
        >
          <BetLabelPane
            onTabChange={handleBetPaneTabChange}
            bet={bet}
            periodType={reportPeriodType}
            period={period}
            betLabelId={BetLabels.GoalsOverUnder.apiFootballLabelId}
          />
        </TabPane>
      </Tabs>
    </Container>
  )
}

export default BookmakerExplorerPage
