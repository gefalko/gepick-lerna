import React, { useCallback, useEffect, useState } from 'react'

import styled from 'styled-components'
import { Button } from 'antd'
import moment, { Moment } from 'moment'
import useBreakPoints from '@gepick/components/hooks/useBreakPoints'
import Container from '@gepick/components/container/Container'
import { colors } from '@gepick/assets/styles/cssVariables'
import useSwitch from '@gepick/components/hooks/useSwitch'
import useUrlParamState from '@gepick/components/hooks/useUrlParamState'
import ArrowDatePicker from '@gepick/components/datePicker/ArrowDatePicker'
import { MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined } from '@ant-design/icons'
import useBotSelect from 'components/botSelect/useBotSelect'
import useBetSelect from 'components/betSelect/useBetSelect'
import useProbabilitiesRange from 'components/probabilitiesRange/useProbabilitiesRange'
import useSliderRange from 'components/rangeSlider/useRangeSlider'
import useOddIndexSelect from 'components/oddIndexSelect/useOddIndexSelect'

interface IStyledMenuSidebar {
  open: boolean
  isMobile: boolean
}

const StyledMenuSidebar = styled.div`
  width: ${({ open }: IStyledMenuSidebar) => (open ? '288px' : '0px')};
  background: ${colors.primary};
  min-height: 100vh;
  padding: 5px;
  padding-top: 20px;
  position: ${({ isMobile }: IStyledMenuSidebar) => (isMobile ? 'fixed' : 'relative')};
  z-index: 1;

  #side_bar_container {
    display: ${({ open }: IStyledMenuSidebar) => (open ? 'block' : 'none')};
    position: fixed;
    width: 270px;
    color: ${colors.white};
  }

  #controller {
    position: fixed;
    left: ${({ open }: IStyledMenuSidebar) => (open ? '280px' : '0')};
    top: 65px;
    padding: 10px;
    z-index: 1;
    background: ${colors.primary};
    cursor: pointer;
  }
`

const iconStyle = {
  fontSize: '20px',
  color: colors.white,
}

export interface IPredictSettings {
  day: string
  probabilitiesFrom: number
  probabilitiesTo: number
  betLabelId: number
  bet: string
  botDockerImage: string
  valueFrom: number
  valueTo: number
  oddProbabilityFrom: number
  oddProbabilityTo: number
  oddIndex: number
}

interface IProps {
  onPredict: (settings: IPredictSettings) => Promise<void>
}

const SettingsSideBar: React.FunctionComponent<IProps> = (props) => {
  const { isMobile } = useBreakPoints()
  const [filterSidebarOpen, switchFilterSidebarOpen] = useSwitch(!isMobile)
  const [selectedDay, setDay] = useUrlParamState('day', moment().format('YYYY-MM-DD'))
  const [botDockerImage, selectBotComponent] = useBotSelect()
  const [betLabelId, bet, betSelectComponent] = useBetSelect()
  const [probabilitiesFrom, probabilitiesTo, probabilitiesRangeComponent] = useProbabilitiesRange()
  const [oddIndex, oddIndexSelectComponent] = useOddIndexSelect({ defaultIndex: 0 })
  const [valueFrom, valueTo, valueSliderComponent] = useSliderRange({
    fromName: 'valueFrom',
    toName: 'valueTo',
    fromDefaultValue: '-100',
    toDefaultValue: '100',
    min: -100,
    max: 100,
  })
  const [oddProbabilityFrom, oddProbabilityTo, oddProbabilitySliderComponent] = useSliderRange({
    fromName: 'oddProbabilityFrom',
    toName: 'oddProbabilityTo',
    fromDefaultValue: '0',
    toDefaultValue: '100',
  })
  const [predicted, setPredicted] = useState<boolean>(false)

  const handleDayChange = useCallback(
    (newDay: Moment) => {
      setDay(moment(newDay).format('YYYY-MM-DD'))
      window.scrollTo(0, 0)
    },
    [setDay],
  )

  const date = selectedDay ? new Date(selectedDay) : new Date()

  const handlePredictClick = useCallback(() => {
    if (
      selectedDay &&
      probabilitiesFrom != null &&
      probabilitiesTo != null &&
      betLabelId &&
      bet &&
      botDockerImage &&
      valueFrom != null &&
      valueTo != null &&
      oddProbabilityFrom != null &&
      oddProbabilityTo != null &&
      oddIndex != null
    ) {
      props.onPredict({
        day: selectedDay,
        probabilitiesFrom,
        probabilitiesTo,
        betLabelId,
        bet,
        botDockerImage,
        valueFrom,
        valueTo,
        oddProbabilityFrom,
        oddProbabilityTo,
        oddIndex,
      })
      setPredicted(true)
      if (isMobile) {
        switchFilterSidebarOpen()
      }
    }
  }, [
    isMobile,
    switchFilterSidebarOpen,
    props,
    selectedDay,
    probabilitiesFrom,
    probabilitiesTo,
    betLabelId,
    bet,
    botDockerImage,
    valueFrom,
    valueTo,
    oddProbabilityFrom,
    oddProbabilityTo,
    oddIndex,
  ])

  useEffect(() => {
    if (!predicted) {
      handlePredictClick()
    }
  }, [
    handlePredictClick,
    predicted,
    selectedDay,
    selectedDay,
    probabilitiesFrom,
    probabilitiesTo,
    betLabelId,
    bet,
    botDockerImage,
    valueFrom,
    valueTo,
    oddProbabilityFrom,
    oddProbabilityTo,
    oddIndex,
  ])

  return (
    <StyledMenuSidebar isMobile={isMobile} open={filterSidebarOpen}>
      <Container id="controller" onClick={switchFilterSidebarOpen}>
        {filterSidebarOpen ? <MenuFoldOutlined style={iconStyle} /> : <MenuUnfoldOutlined style={iconStyle} />}
      </Container>
      <Container id="side_bar_container">
        <Container fullWidth>
          <Container>Day:</Container>
          <Container justifyContentCenter>
            <ArrowDatePicker white date={moment(date)} onChange={handleDayChange} />
          </Container>
        </Container>
        <Container marginTop={16} fullWidth justifyContentCenter flexDirectionColumn>
          <Container>Predictions bot:</Container>
          <Container fullWidth>{selectBotComponent}</Container>
        </Container>
        <Container marginTop={16} fullWidth justifyContentCenter flexDirectionColumn>
          <Container>Bet:</Container>
          <Container fullWidth>{betSelectComponent}</Container>
        </Container>
        <Container marginTop={16} fullWidth justifyContentCenter flexDirectionColumn>
          <Container>Odd level:</Container>
          <Container fullWidth>{oddIndexSelectComponent}</Container>
        </Container>
        <Container marginTop={16} fullWidth justifyContentCenter flexDirectionColumn>
          <Container>
            Probabilities ({probabilitiesFrom}-{probabilitiesTo})%:
          </Container>
          <Container fullWidth>{probabilitiesRangeComponent}</Container>
        </Container>
        <Container marginTop={16} fullWidth justifyContentCenter flexDirectionColumn>
          <Container>
            Odd probability ({oddProbabilityFrom}-{oddProbabilityTo})%:
          </Container>
          <Container fullWidth>{oddProbabilitySliderComponent}</Container>
        </Container>
        <Container marginTop={16} fullWidth justifyContentCenter flexDirectionColumn>
          <Container>
            Value ({valueFrom} - {valueTo})%:
          </Container>
          <Container fullWidth>{valueSliderComponent}</Container>
        </Container>
        <Container marginTop={16} fullWidth justifyContentCenter flexDirectionColumn>
          <Button onClick={handlePredictClick} icon={<SettingOutlined />} size="large" danger type="primary">
            PREDICT
          </Button>
        </Container>
      </Container>
    </StyledMenuSidebar>
  )
}

export default SettingsSideBar
