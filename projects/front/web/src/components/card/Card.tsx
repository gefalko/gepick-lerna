import React from 'react'
import styled from 'styled-components'
import useBreakPoints from '@gepick/components/hooks/useBreakPoints'
import Container from '@gepick/components/container/Container'

const StyledContainer = styled(Container)<{ borderColor: string; isMobile: boolean }>`
  border: 1px solid ${(props) => props.borderColor};
  padding: ${(props) => (props.isMobile ? '16px 8px' : '24px')};
`

interface IProps {
  color: string
  noJustifyContentCenter?: boolean
}

const Card: React.FunctionComponent<IProps> = (props) => {
  const { isMobile } = useBreakPoints()

  return (
    <StyledContainer justifyContentCenter={!props.noJustifyContentCenter} isMobile={isMobile} borderColor={props.color}>
      {props.children}
    </StyledContainer>
  )
}

export default Card
