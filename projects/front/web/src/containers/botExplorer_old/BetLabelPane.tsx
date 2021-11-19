import React from 'react'
import { map, find } from 'lodash'
import { BetLabelIdEnum, BetLabels } from '@gepick/utils/src/BetLabels'
import { Tabs } from 'antd'
import BetPane from './BetPane'

const { TabPane } = Tabs

interface IProps {
  betLabelId: BetLabelIdEnum
  dayFrom: string
  dayTo: string
}

const BetLabelPane: React.FunctionComponent<IProps> = (props) => {
  const betLabel = find(BetLabels, (item) => {
    return item.apiFootballLabelId === props.betLabelId
  })

  return (
    <Tabs>
      {map(betLabel?.values ?? {}, (value, key) => {
        return (
          <TabPane tab={key} key={key}>
            <BetPane dayTo={props.dayTo} dayFrom={props.dayFrom} betLabelId={props.betLabelId} bet={value} />
          </TabPane>
        )
      })}
    </Tabs>
  )
}

export default BetLabelPane
