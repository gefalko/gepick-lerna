import React from 'react'
import styled from 'styled-components'
import Container from '../container/Container'

const StyledButton = styled.button`
  background-color: rgb(255, 66, 77);
  cursor: pointer;
  border-radius: 9999px;
  border: 1px solid rgb(255, 66, 77);
  display: flex;
  padding-top: 5px;
  padding-right: 10px;
  padding-left: 10px;
`

function Icon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88" width="20px" height="20px">
      <g fillRule="evenodd" clipRule="evenodd">
        <path fill="#ff424d" d="M0 0h122.88v122.88H0V0z" />
        <path
          d="M70.04 32.18c-12.1 0-21.95 9.85-21.95 21.97 0 12.08 9.85 21.9 21.95 21.9 12.07 0 21.88-9.83 21.88-21.9 0-12.11-9.81-21.97-21.88-21.97zM30.96 90.7h10.72V32.18H30.96V90.7z"
          fill="#fff"
        />
      </g>
    </svg>
  )
}

interface IProps {
  onClick?: () => void
}

const BecomeAPatronButton: React.FunctionComponent<IProps> = (props) => {
  const handleClick = () => {
    if (props.onClick) {
      props.onClick()
    }

    window.open('', '_blank')
  }

  return (
    <StyledButton onClick={handleClick}>
      <Container>
        <Icon />
      </Container>
      <Container>Become a patron!</Container>
    </StyledButton>
  )
}

export default BecomeAPatronButton
