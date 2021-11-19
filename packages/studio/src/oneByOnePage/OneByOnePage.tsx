import React, { useCallback, useState } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import Container from '@gepick/components/container/Container'
import Card from '@gepick/components/card/Card'
import { Button, Row, Col, Slider } from 'antd'
import DatePicker from '@gepick/components/datePicker/DatePicker'
import { BetLabels, MatchWinerBetKeysType, GoalsOverUnderBetKeysType, BetType } from '@gepick/utils/src/BetLabels'
import { oddToProbability } from '@gepick/utils/src/utils'
import { predictByChunks, IPredictionBotMatchPredictions } from '@gepick/utils/src/predict'
import Pick, { IPick } from '@gepick/components/pick/Pick'
import { setPickStatus, setPickProfit } from '@gepick/utils/src/pickStatus'
import { getBookmakerName } from '@gepick/utils/src/bookmakers'
import { IMatch, IBookmakerOdds } from '../types'
import collectValuePicks from './collectValuePicks'
import getPredictionProbability from './getPredictionProbability'
import ByBetAndInterval from './ByBetAndInterval'

const StyledTable = styled.table`
  td,
  th {
    padding-right: 10px;
    padding-left: 10px;
  }
`

interface IProps {
  onFetchDayMatches(day: string): Promise<IMatch[]>
}

/*
interface IPicksByInterval {
  probabilityTo: number
}

interface IValuePicksByBetAndProbabilityInterval {
  bet: BetType
  picksByInterval: IPicksByInterval[]
}
*/

const OneByOnePage: React.FunctionComponent<IProps> = (props) => {
  const [day, setDay] = useState<string>(moment().subtract(1, 'd').format('YYYY-MM-DD'))
  const [matches, setMatches] = useState<IMatch[]>([])
  const [picks, setPicks] = useState<IPick[]>([])
  const [matchesPredictions, setMatchesPredictions] = useState<IPredictionBotMatchPredictions[]>([])
  const [fetchingMatches, setFetchingMatches] = useState<boolean>(false)
  const [predictingPercent, setPredictingPercent] = useState<number>()
  const [probabilityLimit, setProbabilityiLimit] = useState<number>(70)
  const { onFetchDayMatches } = props

  const handleLoadMatches = useCallback(async () => {
    setFetchingMatches(true)
    const dayMatches = await onFetchDayMatches(day)
    setMatches(dayMatches)
    setFetchingMatches(false)
  }, [day, onFetchDayMatches])

  const handleDayChange = useCallback((newDay: Date) => {
    setDay(moment(newDay).format('YYYY-MM-DD'))
  }, [])

  const handlePredict = useCallback(
    async (matchId: string) => {
      const [predictions] = await predictByChunks(
        {
          matchesIds: [matchId],
          host: 'http://localhost:5000',
          chunkSize: 10,
        },
        setPredictingPercent,
      )
      setPredictingPercent(undefined)
      setMatchesPredictions([...matchesPredictions, predictions])
    },
    [matchesPredictions],
  )

  const handlePredictAll = useCallback(async () => {
    const matchesIds = matches.map((match) => match._id)

    const predictions = await predictByChunks({
      matchesIds,
      host: 'http://localhost:5000',
      chunkSize: 10,
    })

    setMatchesPredictions(predictions)
  }, [matches])

  const handleCollectValuePicks = useCallback(() => {
    const valuePicks = collectValuePicks({
      matches,
      matchOdds: [],
      matchesPredictions,
    })

    setPicks(valuePicks)
  }, [matchesPredictions, matches])

  const toOdd = (
    bookmakerOdds: IBookmakerOdds,
    matchPredictions: IPredictionBotMatchPredictions | undefined,
    onClick: (bet: BetType, oddSize: number, bookmakerId: number, betLabelId: number) => void,
  ) => {
    const matchWinnerOdds = bookmakerOdds.bets.find((bet) => bet.labelId === BetLabels.MatchWinner.apiFootballLabelId)
    const underOverOdds = bookmakerOdds.bets.find((bet) => bet.labelId === BetLabels.GoalsOverUnder.apiFootballLabelId)

    const getOddSize = (bet: BetType) => {
      const matchWinnerValue = (matchWinnerOdds?.value ?? []).find((item) => item.value === bet)

      const underOverWinnerValue = (underOverOdds?.value ?? []).find((item) => item.value === bet)

      const odd = matchWinnerValue?.odd ?? underOverWinnerValue?.odd

      if (!odd) {
        return '-'
      }

      const getBetLabelId = () => {
        if (matchWinnerValue) {
          return BetLabels.MatchWinner.apiFootballLabelId
        }

        if (underOverWinnerValue) {
          return BetLabels.GoalsOverUnder.apiFootballLabelId
        }

        throw new Error('Bad label id')
      }

      const probability = matchPredictions ? getPredictionProbability(matchPredictions, bet) : null
      const bookmakerProbability = oddToProbability(odd)

      const getBorder = () => {
        if (!probability) {
          return undefined
        }

        if (probability < bookmakerProbability) {
          return undefined
        }

        if (probability > bookmakerProbability) {
          return '1px solid green'
        }

        return undefined
      }

      return (
        <Container
          style={{ border: getBorder() }}
          cursor="pointer"
          onClick={() => onClick(bet, odd, bookmakerOdds.bookmakerId, getBetLabelId())}
        >
          <Container>{odd}</Container>
          <Container>{bookmakerProbability}%</Container>
        </Container>
      )
    }

    return (
      <tr>
        <td>{getBookmakerName(bookmakerOdds.bookmakerId)}</td>
        <td>{getOddSize('Home')}</td>
        <td>{getOddSize('Draw')}</td>
        <td>{getOddSize('Away')}</td>
        <td>{getOddSize('Under 0.5')}</td>
        <td>{getOddSize('Over 0.5')}</td>
        <td>{getOddSize('Under 1.5')}</td>
        <td>{getOddSize('Over 1.5')}</td>
        <td>{getOddSize('Under 2.5')}</td>
        <td>{getOddSize('Over 2.5')}</td>
        <td>{getOddSize('Under 3.5')}</td>
        <td>{getOddSize('Over 3.5')}</td>
        <td>{getOddSize('Under 4.5')}</td>
        <td>{getOddSize('Over 4.5')}</td>
        <td>{getOddSize('Under 5.5')}</td>
        <td>{getOddSize('Over 5.5')}</td>
        <td>{getOddSize('Under 6.5')}</td>
        <td>{getOddSize('Over 6.5')}</td>
      </tr>
    )
  }

  const toPredictions = (match: IMatch) => {
    const matchPredictions = matchesPredictions.find((predictions) => predictions?.matchId === match._id)

    if (!matchPredictions) {
      return null
    }

    const getProbability = (bet: MatchWinerBetKeysType | GoalsOverUnderBetKeysType) => {
      const probability = getPredictionProbability(matchPredictions, bet)

      if (!probability) {
        return '-'
      }

      return probability + '%'
    }

    return (
      <tr>
        <td>PREDICTIONS</td>
        <td>{getProbability('Home')}</td>
        <td>{getProbability('Draw')}</td>
        <td>{getProbability('Away')}</td>
        <td>{getProbability('Under 0.5')}</td>
        <td>{getProbability('Over 0.5')}</td>
        <td>{getProbability('Under 1.5')}</td>
        <td>{getProbability('Over 1.5')}</td>
        <td>{getProbability('Under 2.5')}</td>
        <td>{getProbability('Over 2.5')}</td>
        <td>{getProbability('Under 3.5')}</td>
        <td>{getProbability('Over 3.5')}</td>
        <td>{getProbability('Under 4.5')}</td>
        <td>{getProbability('Over 4.5')}</td>
        <td>{getProbability('Under 5.5')}</td>
        <td>{getProbability('Over 5.5')}</td>
        <td>{getProbability('Under 6.5')}</td>
        <td>{getProbability('Over 6.5')}</td>
      </tr>
    )
  }

  const toMatch = (match: IMatch) => {
    const handleOddClick = (bet: BetType, oddSize: number, bookmakerId: number, betLabelId: number) => {
      const matchPredictions = matchesPredictions.find((predictions) => predictions?.matchId === match._id)

      if (!matchPredictions) {
        return null
      }

      const probability = getPredictionProbability(matchPredictions, bet)

      if (!probability) {
        return null
      }

      const status = setPickStatus(match, betLabelId, bet)

      const pick = {
        status,
        match,
        probability,
        bet,
        oddSize,
        bookmakerId,
        botDockerImage: '-',
        profit: setPickProfit(oddSize, status),
      } as IPick

      setPicks([...picks, pick])

      return undefined
    }

    const matchPredictions = matchesPredictions.find((predictions) => predictions?.matchId === match._id)

    return (
      <Container marginBottom={20}>
        <Row>
          <Col span={4}>{moment(match.startTime).format('YYYY-MM-DD HH:mm')}</Col>
          <Col span={4}>
            {match.countryName} {match.leagueName}
          </Col>
          <Col span={4}>
            {match.homeTeamName} - {match.awayTeamName}
          </Col>
          <Col span={4}>{match.status}</Col>
          <Col span={4}>
            {match.goalsHomeTeam} - {match.goalsAwayTeam}
          </Col>
          <Col span={4}>
            <Button onClick={() => handlePredict(match._id)}>predict</Button>
          </Col>
        </Row>
        <StyledTable>
          <tr>
            <th>bookamker</th>
            <th>home</th>
            <th>draw</th>
            <th>away</th>
            <th>u 0.5</th>
            <th>o 0.5</th>
            <th>u 1.5</th>
            <th>o 1.5</th>
            <th>u 2.5</th>
            <th>o 2.5</th>
            <th>u 3.5</th>
            <th>o 3.5</th>
            <th>u 4.5</th>
            <th>o 4.5</th>
            <th>u 5.5</th>
            <th>o 5.5</th>
            <th>u 6.5</th>
            <th>o 6.5</th>
          </tr>
          {toPredictions(match)}
          {[].map((odd) => toOdd(odd, matchPredictions, handleOddClick))}
        </StyledTable>
        <hr />
      </Container>
    )
  }

  return (
    <Container fullWidth>
      <Card width="100%">
        <Container justifyContentSpaceBetween>
          <Container>
            <Container flex>
              <Container>
                <Container>
                  <b>Day:</b>
                </Container>
                <Container>
                  <DatePicker compact value={new Date(day)} onChange={handleDayChange} />
                </Container>
              </Container>
              <Container>
                <Container>
                  <b>Probability limit:</b>
                </Container>
                <Container>
                  <Slider
                    defaultValue={probabilityLimit}
                    min={0}
                    max={100}
                    step={1}
                    onAfterChange={setProbabilityiLimit}
                  />
                </Container>
              </Container>
              <Container width={5} />
              <Container>
                <Container>
                  <b>Actions:</b>
                </Container>
                <Container flex>
                  <Button loading={fetchingMatches} onClick={handleLoadMatches} type="primary">
                    load matches
                  </Button>
                  <Container width={5} />
                  <Button loading={predictingPercent !== undefined} onClick={handlePredictAll} type="primary">
                    predict all {predictingPercent && `${predictingPercent} %`}
                  </Button>
                  <Container width={5} />
                  <Button onClick={handleCollectValuePicks} type="primary">
                    collect value picks
                  </Button>
                </Container>
              </Container>
            </Container>
          </Container>
        </Container>
      </Card>
      <Card width="100%">
        <ByBetAndInterval picks={picks} />
      </Card>
      <Card width="100%">
        <Container>Total picks: {picks.length}</Container>
        {picks.map((pick) => (
          <Pick pick={pick} />
        ))}
      </Card>
      <Card width="100%">
        <Container>Total matches: {matches.length}</Container>
        {matches.map(toMatch)}
      </Card>
    </Container>
  )
}

export default OneByOnePage
