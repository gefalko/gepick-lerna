import React, { useCallback } from 'react'
import moment from 'moment'
import { Tabs } from 'antd'
import PageTitle from 'components/pageTitle/PageTitle'
import Container from '@gepick/components/container/Container'
import DatePicker from '@gepick/components/datePicker/DatePicker'
import { BetLabels } from '@gepick/utils/src/BetLabels'
import useUrlParamState from '@gepick/components/hooks/useUrlParamState'
import BetLabelPane from './BetLabelPane'

const { TabPane } = Tabs

const BotExplorerPage: React.FunctionComponent<{}> = () => {
  const [selectedDay, setDay] = useUrlParamState('day', moment().subtract(1, 'days').format('YYYY-MM-DD'))
  const selectedDate = selectedDay ? new Date(selectedDay) : new Date()
  const handleDayChange = useCallback(
    (newDay: Date) => {
      setDay(moment(newDay).format('YYYY-MM-DD'))
      window.scrollTo(0, 0)
    },
    [setDay],
  )

  return (
    <Container margin={20}>
      <PageTitle pageTitle="Bookmaker explorer" />
      <Container>
        <DatePicker compact value={selectedDate} onChange={handleDayChange} />
      </Container>
      {selectedDay && (
        <Tabs>
          <TabPane destroyInactiveTabPane tab={BetLabels.MatchWinner.name} key={1}>
            <BetLabelPane
              dayFrom={selectedDay}
              dayTo={selectedDay}
              betLabelId={BetLabels.MatchWinner.apiFootballLabelId}
            />
          </TabPane>
          <TabPane destroyInactiveTabPane tab={BetLabels.GoalsOverUnder.name} key={2}>
            <BetLabelPane
              dayFrom={selectedDay}
              dayTo={selectedDay}
              betLabelId={BetLabels.GoalsOverUnder.apiFootballLabelId}
            />
          </TabPane>
        </Tabs>
      )}
    </Container>
  )
}

export default BotExplorerPage
