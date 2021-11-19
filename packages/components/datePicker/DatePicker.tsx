import React from 'react'
import styled from 'styled-components'
import DatePickerOrginal from 'react-datepicker'
import { colors } from '@gepick/assets/styles/cssVariables'
import 'react-datepicker/dist/react-datepicker.css'

const StyledInlineContainer = styled.div`
  .react-datepicker {
    border: 0;
  }
  .react-datepicker__header {
    background-color: ${colors.white};
  }
  .react-datepicker__day--selected {
    background-color: ${colors.primary};
  }
`

const StyledContainer = styled.div`
  input {
    width: 100px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
  }

  input:focus {
    border-color: #40a9ff;
  }
`

interface IProps {
  value: Date
  compact?: boolean
  onChange: (newValue: Date) => void
}

const DatePicker: React.FunctionComponent<IProps> = (props) => {
  if (props.compact) {
    return (
      <StyledContainer>
        <DatePickerOrginal dateFormat="yyyy-MM-dd" selected={props.value} onChange={props.onChange} />
      </StyledContainer>
    )
  }

  return (
    <StyledInlineContainer>
      <DatePickerOrginal inline selected={props.value} onChange={props.onChange} />
    </StyledInlineContainer>
  )
}

export default React.memo(DatePicker)
