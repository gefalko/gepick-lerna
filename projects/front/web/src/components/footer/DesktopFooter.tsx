import React from 'react'
import { Layout } from 'antd'
import styled from 'styled-components'
import Link from '@gepick/components/link/Link'
import Container from '@gepick/components/container/Container'
import { footerStyles, desktopBodyStyles } from '@gepick/assets/styles/cssVariables'
import brandBook from '@gepick/assets/styles/brandBook'
import Text from '@gepick/components/text/Text'
import routes from 'routes/routes'

const StyledFooter = styled(Layout.Footer)`
  z-index: 2;

  &.ant-layout-footer {
    background: ${footerStyles.backgroundColor};
    color: ${footerStyles.textColor};
    padding-left: ${desktopBodyStyles.contentPadding};
    padding-right: ${desktopBodyStyles.contentPadding};
  }

  a {
    color: ${footerStyles.textColor};
  }
`

const DesktopFooter: React.FunctionComponent<{}> = () => {
  return (
    <StyledFooter>
      <Container justifyContentSpaceBetween>
        <Container flex noWrap>
          <Container marginRight={40}>
            <Container>Help us build gepick:</Container>
            <Container>
              <Link href={routes.patreon} targetBlank>
                Become a patron
              </Link>
            </Container>
          </Container>
          <Container marginRight={40}>
            <Container>Follow as on:</Container>
            <Container>
              <Link href={routes.facebook} targetBlank>
                facebook
              </Link>
              <Text>, </Text>
              <Link href={routes.medium} targetBlank>
                medium
              </Link>
            </Container>
          </Container>
          <Container>
            <Container>Have questions? write:</Container>
            <Container>help@gepick.com</Container>
          </Container>
        </Container>
        <Container>
          <Container>
            <Text style={brandBook.bold}>Gepick</Text>
          </Container>
          <Container>{new Date().getFullYear()}</Container>
        </Container>
      </Container>
    </StyledFooter>
  )
}

export default React.memo(DesktopFooter)
