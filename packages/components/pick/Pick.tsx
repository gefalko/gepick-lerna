import React from 'react'
import moment from 'moment'
import { round } from 'lodash'
import { Tag, Descriptions } from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  RightOutlined,
  DownOutlined,
} from '@ant-design/icons'
import { getBookmakerName } from '@gepick/utils/src/bookmakers'
import { PickStatusEnum } from '@gepick/utils/src/PickStatusEnum'
import useSwitch from '../hooks/useSwitch'
import Container from '../container/Container'
import PickContainer from './PickContainer'

interface IMatch {
  startTime: Date | string
  homeTeamName: string
  awayTeamName: string
  goalsHomeTeam: number | null
  goalsAwayTeam: number | null
  niceStatus: string
  countryName: string
  leagueName: string
}

export interface IPick {
  status: PickStatusEnum
  match: IMatch
  probability: number
  bet: string
  oddSize: number
  bookmakerId: number
  botDockerImage: string
  profit: number | null
}

interface IProps {
  pick: IPick
}

const correctPickCardStyle = { border: '1px solid #52c41a', backgroundColor: '#effbee' }
const notCorrectPickCardStyle = { border: '1px solid #ffa39e', backgroundColor: '#f0f0f0' }
const cancelPickCardStyle = { border: '1px solid #91d5ff', backgroundColor: '#f0f0f0' }
const waitingPickCardStyle = { border: '1px solid #91d5ff', backgroundColor: '#f0f0f0' }
const tagContainerStyle = { width: 90, display: 'inline-block' }

const Pick: React.FunctionComponent<IProps> = (props) => {
  const [visible, switchPanel] = useSwitch()
  const { match } = props.pick

  const tagComponent = () => {
    if (props.pick.status === PickStatusEnum.CORRECT) {
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Correct
        </Tag>
      )
    }

    if (props.pick.status === PickStatusEnum.NOT_CORRECT) {
      return (
        <Tag icon={<CloseCircleOutlined />} color="error">
          Wrong
        </Tag>
      )
    }

    if (props.pick.status === PickStatusEnum.CANCELED) {
      return (
        <Tag icon={<ExclamationCircleOutlined />} color="warning">
          Canceled
        </Tag>
      )
    }

    return (
      <Tag color="processing" icon={<ClockCircleOutlined />}>
        Waiting
      </Tag>
    )
  }

  const pickCardStyle = React.useMemo(() => {
    if (props.pick.status === PickStatusEnum.CORRECT) {
      return correctPickCardStyle
    }

    if (props.pick.status === PickStatusEnum.NOT_CORRECT) {
      return notCorrectPickCardStyle
    }

    if (props.pick.status === PickStatusEnum.CANCELED) {
      return cancelPickCardStyle
    }

    return waitingPickCardStyle
  }, [props.pick])

  const teams = (
    <span>
      <span style={tagContainerStyle}>{tagComponent()}</span>{' '}
      <span>{`${match.homeTeamName} - ${match.awayTeamName} `}</span>
    </span>
  )

  const profit = React.useMemo(() => {
    if ((props.pick?.profit ?? 0) > 0 && props.pick?.profit) {
      return `+${round(props.pick.profit, 2)}`
    }

    return props.pick.profit
  }, [props.pick])

  const boldRes = (
    <b>
      {match.goalsHomeTeam}:{match.goalsAwayTeam}
    </b>
  )
  const extra = (
    <>
      {props.pick.probability}% {props.pick.bet} | {profit ?? 0} | {boldRes}{' '}
      {visible ? <DownOutlined /> : <RightOutlined />}
    </>
  )

  return (
    <PickContainer leftComponent={teams} rightComponent={extra} onClick={switchPanel} style={pickCardStyle}>
      {visible && (
        <Container style={{ backgroundColor: '#fff', padding: 10, marginTop: 5 }}>
          <Descriptions size="small">
            <Descriptions.Item label="Time">{moment(match.startTime).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
            <Descriptions.Item label="Country">{match.countryName}</Descriptions.Item>
            <Descriptions.Item label="League">{match.leagueName}</Descriptions.Item>
            <Descriptions.Item label="Match status">{match.niceStatus}</Descriptions.Item>
            <Descriptions.Item label="Bookmaker">{getBookmakerName(props.pick.bookmakerId)}</Descriptions.Item>
            <Descriptions.Item label="Odd size">{props.pick.oddSize}</Descriptions.Item>
            <Descriptions.Item label="Probability">{props.pick.probability}%</Descriptions.Item>
            <Descriptions.Item label="Prediction bot">{props.pick.botDockerImage}</Descriptions.Item>
          </Descriptions>
        </Container>
      )}
    </PickContainer>
  )
}

export default Pick
