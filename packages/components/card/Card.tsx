import React from 'react'
import styled from 'styled-components'
import Container from '../container/Container'

const StyledContainer = styled(Container)`
  box-shadow: 0 25px 50px rgba(8, 21, 66, 0.06);
  border: 0 solid rgba(0, 0, 0, 0.125);
  border-radius: 4px;
  background: #fff;
  padding: 5px;
  margin: 10px 10px 0px 0px;
  max-width: ${(props) => props.width ?? '600px'};
  width: 100%;
`

interface IProps {
  width?: string
  height?: string
}

const Card: React.FunctionComponent<IProps> = (props) => {
  return (
    <StyledContainer width={props.width} height={props.height}>
      {props.children}
    </StyledContainer>
  )
}

export default Card
