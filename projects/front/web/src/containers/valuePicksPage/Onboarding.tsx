import React, { useState } from 'react'
import { colors } from '@gepick/assets/styles/cssVariables'
import Container from '@gepick/components/container/Container'
import Joyride, { CallBackProps, STATUS, Step, EVENTS, ACTIONS } from 'react-joyride'
import { TrackEvents } from '../../services/GoogleAnalytics'

const howItworksComponent = (
  <Container textAlignLeft>
    <Container>1. Using the bookmaker explorer tool we search bookmakers weakness.</Container>
    <Container>2. Then using our prediction bot calculate predictions.</Container>
    <Container>3. We compare our predictions with bookmaker probabilities and find value picks.</Container>
  </Container>
)

const intervalStepComponent = (
  <Container textAlignLeft>
    <Container>
      It is a probability interval card. We convert bookmakers odds to probabilities and group picks by probability
      intervals.
    </Container>
    <Container height={5} />
    <Container>
      <Container>
        A green card means the bookmaker is weak in predicting these interval bet probabilities (odds).
      </Container>
      <Container height={5} />
      <Container>
        The red card means that bookmakers are good for predicting this probability interval. At this interval is hard
        to beat the bets.
      </Container>
    </Container>
  </Container>
)

const intervalKeyStepComponent = (
  <Container>
    Probabilities range (odds) of bets. All picks from this interval have bookmakers probabilities from this range.
  </Container>
)

const betLabelStepComponent = (
  <Container>
    The bet label is bet type like 1x2, under/over... All picks at this interval card are the same bet label.
  </Container>
)

const betStepComponent = (
  <Container>
    The bet is event end like home wins, under 0.5 goals... All picks at this interval card are the same bet.
  </Container>
)

const roiStepComponent = (
  <Container>
    Return of investment shows a profit of each pick on an interval. A greater number is better. A positive number shows
    bookmaker weakness in this interval.
  </Container>
)

const picksStepComponent = (
  <Container>
    List of interval picks. If an interval is hard to predict for bookmakers you should consider analyze picks from this
    interval and do bets.
  </Container>
)

const steps: Step[] = [
  {
    target: 'body',
    placement: 'center',
    title: 'How it works?',
    content: howItworksComponent,
    styles: {
      options: {
        width: '550px',
      },
    },
  },
  {
    target: '[data-onboarding="interval"]',
    content: intervalStepComponent,
    placement: 'center',
    title: 'Interval card',
  },
  {
    target: '[data-onboarding="interval"] [data-onboarding="intervalKey"]',
    content: intervalKeyStepComponent,
    placement: 'auto',
    title: 'Interval key',
  },
  {
    target: '[data-onboarding="interval"] [data-onboarding="betLabel"]',
    content: betLabelStepComponent,
    placement: 'auto',
    title: 'Bet label',
  },
  {
    target: '[data-onboarding="interval"] [data-onboarding="bet"]',
    content: betStepComponent,
    placement: 'auto',
    title: 'Bet',
  },
  {
    target: '[data-onboarding="interval"] [data-onboarding="roi"]',
    content: roiStepComponent,
    placement: 'auto',
    title: 'Return of investment',
  },
  {
    target: '[data-onboarding="picks"]',
    content: picksStepComponent,
    title: 'Interval daily picks',
    placement: 'auto',
  },
]

const Onboarding: React.FunctionComponent<{}> = () => {
  const [joyride, setJoyride] = useState({ run: false, stepIndex: 0 })

  const handleJoyride = (data: CallBackProps) => {
    const { status, action, type, index } = data
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

    if (finishedStatuses.includes(status) || action === 'close') {
      setJoyride({ ...joyride, run: false })
    } else if (type === EVENTS.STEP_AFTER && index === 0) {
      setJoyride({ ...joyride, stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) })
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setJoyride({ ...joyride, stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) })
    } else if (type === EVENTS.TOOLTIP_CLOSE) {
      setJoyride({ ...joyride, stepIndex: index + 1 })
    }
  }

  const startJoyride = () => {
    TrackEvents.valuePicksPage.howItWorksLinkClick()
    setJoyride({ ...joyride, run: true, stepIndex: 0 })
  }

  return (
    <>
      <Joyride
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: colors.primary,
          },
        }}
        scrollOffset={200}
        continuous
        showProgress
        callback={handleJoyride}
        run={joyride.run}
        steps={steps}
      />

      <Container onClick={startJoyride}>
        <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>How it works?</span>
      </Container>
    </>
  )
}

export default Onboarding
