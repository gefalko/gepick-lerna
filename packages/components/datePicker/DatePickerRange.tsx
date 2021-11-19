import React, { useCallback } from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import styled from 'styled-components'
import Container from '@gepick/components/container/Container'

import 'react-datepicker/dist/react-datepicker.css'

const StyledContainer = styled(Container)`
  input {
    width: 100px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    color: #000;
  }

  input:focus {
    border-color: #40a9ff;
  }
`

interface IProps {
  fromDate: Date
  toDate: Date
  inline?: boolean
  onChange: (from: Date, to: Date) => void
}

const DatePickerRange: React.FunctionComponent<IProps> = (props) => {
  const { onChange, fromDate, toDate } = props

  const handleChangeFrom = useCallback(
    (date: Date) => {
      onChange(date, toDate)
    },
    [onChange, toDate],
  )
  const handleChangeTo = useCallback(
    (date: Date) => {
      onChange(fromDate, date)
    },
    [onChange, fromDate],
  )

  return (
    <StyledContainer
      width={props.inline ? '100%' : 215}
      justifyContentSpaceBetween={!props.inline}
      justifyContentCenter={props.inline}
    >
      {props.inline && (
        <Container>
          {moment(props.fromDate).format('YYYY-MM-DD')} - {moment(props.toDate).format('YYYY-MM-DD')}
        </Container>
      )}
      <Container>
        <DatePicker
          inline={props.inline}
          dateFormat="yyyy-MM-dd"
          selected={props.fromDate}
          onChange={handleChangeFrom}
        />
      </Container>
      <Container lineHeight={32}>-</Container>
      <Container>
        <DatePicker inline={props.inline} dateFormat="yyyy-MM-dd" selected={props.toDate} onChange={handleChangeTo} />
      </Container>
    </StyledContainer>
  )
}

export default DatePickerRange
