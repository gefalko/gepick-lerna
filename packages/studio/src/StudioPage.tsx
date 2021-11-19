import React, { useState, useCallback, useMemo } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { Tabs, Button, Input, Empty } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { flatten } from 'lodash'
import { predictByChunks } from '@gepick/utils/src/predict'
import { filterValuePicks } from '@gepick/utils/src/toPick'
import { generateReport, IReport, IPick as IGenerateReportPick } from '@gepick/utils/src/generateReport'
import ProfitBarCharts from '@gepick/components/profitBarCharts/ProfitBarCharts'
import Container from '@gepick/components/container/Container'
import DatePickerRange from '@gepick/components/datePicker/DatePickerRange'
import { printlog } from '@gepick/utils/src/printlog'
import { enumerateDaysBetweenDates } from '@gepick/utils/src/dates'
import Card from '@gepick/components/card/Card'
import useBoolean from '@gepick/components/hooks/useBoolean'
import Link from '@gepick/components/link/Link'
import PushBotModal, { IFormData as IOnUplaodBotData } from './PushBotModal'
import OneByOnePage from './oneByOnePage/OneByOnePage'
import { Bet, IMatch } from './types'

const { TabPane } = Tabs

const StyledTabs = styled(Tabs)`
  .ant-tabs-content-holder {
    min-height: calc(100vh - 148px) !important;
  }

  .ant-tabs-content {
    height: 100%;
  }

  .ant-tabs-nav-list {
    height: 100%;
    background: #fff;
    width: 140px;
  }

  .ant-tabs-tab {
    background: #fff !important;
    border: none !important;
  }
`

async function predictAndGenerateReport(matches: IMatch[], host: string, onProgres: (percent: number) => void) {
  const matchesIds = matches.map((m) => m._id)

  const botPredictions = await predictByChunks(
    {
      matchesIds,
      host,
      chunkSize: 10,
    },
    onProgres,
  )

  const allPicks = botPredictions.map((p) => {
    const match = matches.find((m) => m._id === p.matchId)
    // const formatedPredictions = formatBetPredictions(p)

    if (match) {
      const valuePicks = filterValuePicks({
        match,
        matchPredictions: [],
        matchOdds: [],
        bot: null,
      })

      return valuePicks
    }

    return null
  })

  const getPicksByBetReports = (bet: Bet) => {
    const picksByBet = flatten(
      allPicks.map((p) => {
        if (p) {
          return p[bet]
        }

        return null
      }),
    )

    const picks = picksByBet.filter((p) => p != null)

    return generateReport(picks as IGenerateReportPick[])
  }

  const homePicksReport = getPicksByBetReports('home')
  const drawPicksReport = getPicksByBetReports('draw')
  const awayPicksReport = getPicksByBetReports('away')
  const underPicksReport = getPicksByBetReports('under')
  const overPicksReport = getPicksByBetReports('over')

  return {
    home: homePicksReport,
    draw: drawPicksReport,
    away: awayPicksReport,
    under: underPicksReport,
    over: overPicksReport,
  }
}

interface IReportsByDay {
  day: string
  home: IReport
  draw: IReport
  away: IReport
  under: IReport
  over: IReport
}

interface IPprops {
  authorized: boolean
  fetchMore: (day: string) => Promise<IMatch[]>
  onBotUpload: (data: IOnUplaodBotData) => Promise<{ error?: string }>
}

interface IProgress {
  day: string
  percent?: number
  fetching: boolean
}

export const StudioPage: React.FunctionComponent<IPprops> = (props) => {
  const [reportsByDays, setReports] = useState<IReportsByDay[]>([])
  const [progress, setProgress] = useState<IProgress>()
  const [botUrl, setBotUrl] = useState<string>('http://localhost:5000')
  const [pushBotModalVisible, openPushBotModal, closePushBotModal] = useBoolean()

  const [daysRange, setDaysRange] = useState<{ from: string; to: string }>({
    from: moment().subtract(8, 'd').format('YYYY-MM-DD'),
    to: moment().subtract(1, 'd').format('YYYY-MM-DD'),
  })

  const { fetchMore } = props

  const startPredicting = useCallback(async () => {
    const days = enumerateDaysBetweenDates(daysRange.from, daysRange.to)
    setReports([])

    for (const day of days) {
      setProgress({
        day,
        fetching: true,
      })
      const dayMatches = await fetchMore(day)
      const handleSetPercent = (percent: number) => {
        setProgress({ day, fetching: false, percent })
      }
      const report = await predictAndGenerateReport(dayMatches, botUrl, handleSetPercent)
      setReports((prevReportsByDays) => [...prevReportsByDays, { day, ...report }])
    }

    setProgress(undefined)
  }, [fetchMore, daysRange, setProgress, botUrl])

  const handleBarClick = useCallback((day: string, bet: Bet) => {
    printlog(day, bet)
  }, [])

  const handleDaysChange = useCallback(
    (from: Date, to: Date) => {
      setDaysRange({ from: moment(from).format('YYYY-MM-DD'), to: moment(to).format('YYYY-MM-DD') })
    },
    [setDaysRange],
  )

  const predictButtonText = useMemo(() => {
    if (!progress) {
      return 'predict'
    }

    if (progress.fetching) {
      return 'fetching data'
    }

    return `predicting ${progress.day} ${progress?.percent}%`
  }, [progress])

  const handleChangeBotUrl = (event: React.FocusEvent<HTMLInputElement>) => {
    setBotUrl(event.target.value)
  }

  return (
    <Container background="#f1f4f6">
      <StyledTabs tabPosition="left" type="card">
        <TabPane style={{ height: '100%' }} tab="Reporting" key="1">
          <Container fullHeight>
            <Container marginRight={10}>
              <Card width="100%">
                <Container justifyContentSpaceBetween>
                  <Container>
                    <Container flex>
                      <Container>
                        <Container>
                          <b>Dates range:</b>
                        </Container>
                        <Container>
                          <DatePickerRange
                            fromDate={new Date(daysRange.from)}
                            toDate={new Date(daysRange.to)}
                            onChange={handleDaysChange}
                          />
                        </Container>
                      </Container>
                      <Container width={5} />
                      <Container>
                        <Container>
                          <b>Your bot url:</b>
                        </Container>
                        <Container width={250}>
                          <Input disabled={progress !== undefined} value={botUrl} onChange={handleChangeBotUrl} />
                        </Container>
                      </Container>
                      <Container width={5} />
                      <Container>
                        <Container>
                          <b>Actions:</b>
                        </Container>
                        <Container>
                          <Button onClick={startPredicting} type="primary" loading={progress !== undefined}>
                            {predictButtonText}
                          </Button>
                        </Container>
                      </Container>
                    </Container>
                  </Container>
                  <Container>
                    <Container height={22} />
                    <Container>
                      <Button onClick={openPushBotModal} type="primary" icon={<UploadOutlined />}>
                        push bot
                      </Button>
                    </Container>
                  </Container>
                </Container>
              </Card>
            </Container>
            <Container fullHeight fullWidth marginBottom={20}>
              {reportsByDays.length > 0 && <ProfitBarCharts reports={reportsByDays} onBarClick={handleBarClick} />}
              {!reportsByDays.length && (
                <Card width="100%">
                  <Container justifyContentCenter>
                    <Container marginBottom={10}>
                      <Empty description="" />
                      <Container width="450px">
                        There you can test and push your prediction model to gepick ecosystem. Curently how to
                        documentation are preparing. Do you need help for write your first bot, please write to
                        <Link> help@gepick.com</Link>.
                      </Container>
                    </Container>
                  </Container>
                </Card>
              )}
            </Container>
          </Container>
        </TabPane>
        <TabPane tab="One by one" key="2">
          <Container justifyContentCenter fullWidth>
            <OneByOnePage onFetchDayMatches={fetchMore} />
          </Container>
        </TabPane>
        <TabPane tab="Documentation" key="3">
          <Card width="100%">
            <Container justifyContentCenter>
              <Container marginBottom={10}>
                <Container width="450px">
                  Curently how to documentation are preparing. Do you need help for write your first bot, please write
                  to
                  <Link> help@gepick.com</Link>.
                </Container>
              </Container>
            </Container>
          </Card>
        </TabPane>
      </StyledTabs>
      {pushBotModalVisible && (
        <PushBotModal authorized={props.authorized} onSubmit={props.onBotUpload} onClose={closePushBotModal} />
      )}
    </Container>
  )
}
