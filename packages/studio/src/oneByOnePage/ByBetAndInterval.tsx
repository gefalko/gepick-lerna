import React, { useMemo } from 'react'
import { map } from 'lodash'
import { Tabs } from 'antd'
import Pick, { IPick } from '@gepick/components/pick/Pick'
import { BetType } from '@gepick/utils/src/BetLabels'
import Statistic from './Statistic'

interface IProps {
  picks: IPick[]
}

const ByBetAndInterval: React.FunctionComponent<IProps> = (props) => {
  const picksByBetAndInterval = useMemo(() => {
    const filterPicksByBet = (bet: BetType) => {
      return props.picks.filter((pick) => pick.bet === bet)
    }

    const filterByInterval = (picks: IPick[], from: number, to: number) => {
      return picks.filter((pick) => pick.probability >= from && pick.probability < to)
    }

    const formatPickByBetByInteval = (bet: BetType) => {
      const picksByBet = filterPicksByBet(bet)

      return {
        '0-25': filterByInterval(picksByBet, 0, 25),
        '25-50': filterByInterval(picksByBet, 25, 50),
        '50-75': filterByInterval(picksByBet, 50, 75),
        '75-100': filterByInterval(picksByBet, 75, 100),
      }
    }

    return {
      Home: formatPickByBetByInteval('Home'),
      Draw: formatPickByBetByInteval('Draw'),
      Away: formatPickByBetByInteval('Away'),
      'Under 0.5': formatPickByBetByInteval('Under 0.5'),
      'Over 0.5': formatPickByBetByInteval('Over 0.5'),
      'Under 1.5': formatPickByBetByInteval('Under 1.5'),
      'Over 1.5': formatPickByBetByInteval('Over 1.5'),
      'Under 2.5': formatPickByBetByInteval('Under 2.5'),
      'Over 2.5': formatPickByBetByInteval('Over 2.5'),
      'Under 3.5': formatPickByBetByInteval('Under 3.5'),
      'Over 3.5': formatPickByBetByInteval('Over 3.5'),
      'Under 4.5': formatPickByBetByInteval('Under 4.5'),
      'Over 4.5': formatPickByBetByInteval('Over 4.5'),
      'Under 5.5': formatPickByBetByInteval('Under 5.5'),
      'Over 5.5': formatPickByBetByInteval('Over 5.5'),
      'Under 6.5': formatPickByBetByInteval('Under 6.5'),
      'Over 6.5': formatPickByBetByInteval('Over 6.5'),
    }
  }, [props.picks])

  const renderTabpane = (bet: BetType) => {
    const picksByBet = picksByBetAndInterval[bet]

    return (
      <Tabs.TabPane tab={bet} key={bet}>
        <Tabs>
          {map(picksByBet, (picks, key) => {
            return (
              <Tabs.TabPane tab={key} key={key}>
                <Statistic picks={picks} />
                {picks.map((pick) => (
                  <Pick pick={pick} />
                ))}
              </Tabs.TabPane>
            )
          })}
        </Tabs>
      </Tabs.TabPane>
    )
  }

  if (props.picks.length === 0) {
    return null
  }

  return (
    <Tabs>
      {renderTabpane('Home')}
      {renderTabpane('Draw')}
      {renderTabpane('Away')}
      {renderTabpane('Under 0.5')}
      {renderTabpane('Over 0.5')}
      {renderTabpane('Under 1.5')}
      {renderTabpane('Over 1.5')}
      {renderTabpane('Under 2.5')}
      {renderTabpane('Over 2.5')}
      {renderTabpane('Under 3.5')}
      {renderTabpane('Over 3.5')}
      {renderTabpane('Under 4.5')}
      {renderTabpane('Over 4.5')}
      {renderTabpane('Under 5.5')}
      {renderTabpane('Over 5.5')}
      {renderTabpane('Under 6.5')}
      {renderTabpane('Over 6.5')}
    </Tabs>
  )
}

export default ByBetAndInterval
