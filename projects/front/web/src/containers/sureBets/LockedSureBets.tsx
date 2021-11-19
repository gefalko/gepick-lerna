import React, { useCallback } from 'react'
import { round } from 'lodash'
import Container from '@gepick/components/container/Container'
import Card from 'components/card/Card'
import { colors } from '@gepick/assets/styles/cssVariables'
import BecomeAPatronButton from '@gepick/components/becomeAPatronButton/BecomeAPatronButton'
import { TrackEvents } from '../../services/GoogleAnalytics'

interface IProps {
  item: any
}

const LockedSureBets: React.FunctionComponent<IProps> = (props) => {
  const profit = round(props.item.profit * 100, 2)

  const handleABecomeAPatronButtonClick = useCallback(() => {
    TrackEvents.sureBetsPage.becomePatronButtonClick(profit)
  }, [profit])

  return (
    <Card color={colors.green}>
      <Container fullWidth>
        <Container justifyContentCenter color={colors.yellow}>
          <b>
            Unlock bet with{' '}
            <Container color="#73c2fb" inline>
              +{profit}%
            </Container>{' '}
            sure profit
          </b>
        </Container>
        <Container justifyContentCenter marginTop={8} marginBottom={8}>
          <BecomeAPatronButton onClick={handleABecomeAPatronButtonClick} />
        </Container>
        <Container justifyContentCenter>Already patron? please login</Container>
      </Container>
    </Card>
  )
}

export default LockedSureBets
