import React from 'react'
import styled from 'styled-components'
import logoSrc from '@gepick/assets/images/logo_small.png'
import Container from '@gepick/components/container/Container'
import Text from '@gepick/components/text/Text'
import { colors } from '@gepick/assets/styles/cssVariables'
import Image from '../image/Image'

const StyledText = styled(Text)`
  color: ${colors.white};
  font-size: 11px;
  font-style: italic;
`

const LogoContainer = styled(Container)`
  line-height: 20px;
`

const Logo: React.FunctionComponent<{}> = () => {
  return (
    <LogoContainer alignItemsCenter>
      <Container>
        <Image height={20} src={logoSrc} alt="gepick logo" />
        <Container>
          <StyledText>defeat bookmakers</StyledText>
        </Container>
      </Container>
    </LogoContainer>
  )
}

export default React.memo(Logo)
