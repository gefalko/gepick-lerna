import React from 'react'
import { Moment } from 'moment'
import { colors } from '@gepick/assets/styles/cssVariables'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import Container from '../container/Container'

interface IProps {
  date: Moment
  white?: boolean
  onChange: (newDate: Moment) => void
}

const ArrowDatePicker: React.FunctionComponent<IProps> = (props) => {
  const handleBackClick = () => {
    props.onChange(props.date.subtract(1, 'days'))
  }

  const handleNextClick = () => {
    props.onChange(props.date.add(1, 'days'))
  }

  return (
    <Container color={props.white ? colors.white : undefined} width={130} justifyContentSpaceBetween>
      <Container cursor="pointer" onClick={handleBackClick}>
        <LeftOutlined />
      </Container>
      <Container cursor="pointer">{props.date.format('YYYY-MM-DD')}</Container>
      <Container>
        <RightOutlined onClick={handleNextClick} />
      </Container>
    </Container>
  )
}

export default ArrowDatePicker
