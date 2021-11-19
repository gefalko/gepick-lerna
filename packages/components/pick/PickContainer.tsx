import React from 'react'
import Container from '@gepick/components/container/Container'

interface IProps {
  style: React.CSSProperties
  rightComponent: React.ReactNode
  leftComponent: React.ReactNode
  onClick?: () => void
}

const PickContainer: React.FunctionComponent<IProps> = (props) => {
  return (
    <Container
      onClick={props.onClick}
      cursor="pointer"
      marginBottom={10}
      alignItemsCenter
      style={props.style}
      padding={2}
      paddingTop={10}
      paddingBottom={10}
    >
      <Container fullWidth>
        <Container>
          <Container justifyContentSpaceBetween>
            <Container>{props.leftComponent}</Container>
            <Container marginLeft={92}>{props.rightComponent}</Container>
          </Container>
        </Container>
        {props.children}
      </Container>
    </Container>
  )
}

export default PickContainer
