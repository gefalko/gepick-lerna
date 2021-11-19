import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button } from 'antd'
import moment from 'moment'
import useBreakPoints from '@gepick/components/hooks/useBreakPoints'
import Container from '@gepick/components/container/Container'
import { colors } from '@gepick/assets/styles/cssVariables'
import useSwitch from '@gepick/components/hooks/useSwitch'
import useUrlParamState from '@gepick/components/hooks/useUrlParamState'
import DatePickerRange from '@gepick/components/datePicker/DatePickerRange'
import { MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined } from '@ant-design/icons'
import useBotSelect from 'components/botSelect/useBotSelect'
import useOddIndexSelect from 'components/oddIndexSelect/useOddIndexSelect'
import useBetSelect from 'components/betSelect/useBetSelect'
import useProbabilitiesRange from 'components/probabilitiesRange/useProbabilitiesRange'
import useSliderRange from 'components/rangeSlider/useRangeSlider'

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

export interface ISettings {
  fromDay: string
  toDay: string
  probabilityFrom: number
  probabilityTo: number
  betLabelId: number
  bet: string
  botDockerImage: string
  oddProbabilityFrom: number
  oddProbabilityTo: number
  valueFrom: number
  valueTo: number
  oddIndex: number
}

interface IProps {
  onGenerateReport: (settings: ISettings) => Promise<void>
}

const SettingsSideBar: React.FunctionComponent<IProps> = (props) => {
  const { isMobile } = useBreakPoints()
  const [filterSidebarOpen, switchFilterSidebarOpen] = useSwitch(!isMobile)
  const [fromDay, setFromDay] = useUrlParamState('fromDay', moment().subtract(7, 'days').format('YYYY-MM-DD'))
  const [toDay, setToDay] = useUrlParamState('toDay', moment().format('YYYY-MM-DD'))
  const [botDockerImage, selectBotComponent] = useBotSelect()
  const [betLabelId, bet, betSelectComponent] = useBetSelect()
  const [oddIndex, oddIndexSelectComponent] = useOddIndexSelect({ defaultIndex: 0 })
  const [probabilityFrom, probabilityTo, probabilitiesRangeComponent] = useProbabilitiesRange()
  const [valueFrom, valueTo, valueSliderComponent] = useSliderRange({
    fromName: 'valueFrom',
    toName: 'valueTo',
    fromDefaultValue: '-100',
    toDefaultValue: '100',
  })
  const [oddProbabilityFrom, oddProbabilityTo, oddProbabilitySliderComponent] = useSliderRange({
    fromName: 'oddProbabilityFrom',
    toName: 'oddProbabilityTo',
    fromDefaultValue: '0',
    toDefaultValue: '100',
  })

  const [generated, setGenerated] = useState<boolean>(false)

  const handleDaysChange = useCallback(
    (from: Date, to: Date) => {
      setFromDay(moment(from).format('YYYY-MM-DD'))
      setToDay(moment(to).format('YYYY-MM-DD'))
    },
    [setFromDay, setToDay],
  )

  const generateReport = useCallback(() => {
    if (
      fromDay &&
      toDay &&
      probabilityFrom != null &&
      probabilityTo != null &&
      betLabelId &&
      bet &&
      botDockerImage &&
      valueFrom != null &&
      valueTo != null &&
      oddProbabilityFrom != null &&
      oddProbabilityTo != null &&
      oddIndex != null
    ) {
      props.onGenerateReport({
        oddProbabilityFrom,
        oddProbabilityTo,
        fromDay,
        toDay,
        probabilityFrom,
        probabilityTo,
        betLabelId,
        bet,
        botDockerImage,
        valueFrom,
        valueTo,
        oddIndex,
      })
      setGenerated(true)
      if (isMobile) {
        switchFilterSidebarOpen()
      }
    }
  }, [
    isMobile,
    fromDay,
    toDay,
    switchFilterSidebarOpen,
    props,
    probabilityFrom,
    probabilityTo,
    betLabelId,
    oddIndex,
    bet,
    botDockerImage,
    valueFrom,
    valueTo,
    oddProbabilityFrom,
    oddProbabilityTo,
    oddIndex,
  ])

  useEffect(() => {
    if (!generated) {
      generateReport()
    }
  }, [
    generated,
    generateReport,
    isMobile,
    fromDay,
    toDay,
    switchFilterSidebarOpen,
    props,
    probabilityFrom,
    probabilityTo,
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
          <Container>Days interval:</Container>
          <Container justifyContentCenter>
            {fromDay && toDay && (
              <DatePickerRange fromDate={new Date(fromDay)} toDate={new Date(toDay)} onChange={handleDaysChange} />
            )}
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
            Probabilities ({probabilityFrom}-{probabilityTo})%:
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
          <Button onClick={generateReport} icon={<SettingOutlined />} size="large" danger type="primary">
            GENERATE REPORT
          </Button>
        </Container>
      </Container>
    </StyledMenuSidebar>
  )
}

export default SettingsSideBar
