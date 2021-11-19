import React from 'react'
import { Layout } from 'antd'
import styled from 'styled-components'
import Link from '@gepick/components/link/Link'
import Container from '@gepick/components/container/Container'
import { footerStyles, mobileBodyStyles } from '@gepick/assets/styles/cssVariables'
import brandBook from '@gepick/assets/styles/brandBook'
import Text from '@gepick/components/text/Text'
import routes from 'routes/routes'

const StyledFooter = styled(Layout.Footer)`
  z-index: 2;

  &.ant-layout-footer {
    background: ${footerStyles.backgroundColor};
    color: ${footerStyles.textColor};
    padding-left: ${mobileBodyStyles.contentPadding};
    padding-right: ${mobileBodyStyles.contentPadding};
  }

  a {
    color: ${footerStyles.textColor};
  }
`

const MobileFooter: React.FunctionComponent<{}> = () => {
  return (
    <StyledFooter>
      <Container>
        <Container>
          <Container>
            <Text style={brandBook.bold}>Help us build gepick: </Text>
            <Text>
              <Link underline href={routes.patreon} targetBlank>
                Become a patron
              </Link>
            </Text>
          </Container>
          <Container>
            <Text style={brandBook.bold}>Fallow as on: </Text>
            <Text>
              <Link underline href={routes.facebook} targetBlank>
                facebook
              </Link>
              <Text>, </Text>
              <Link underline href={routes.medium} targetBlank>
                medium
              </Link>
            </Text>
          </Container>
          <Container>
            <Text style={brandBook.bold}>Have questions? write: </Text>
            <Text>help@gepick.com</Text>
          </Container>
        </Container>
        <Container height={20} />
        <Container>
          <Container>
            <Text style={brandBook.bold}>Gepick </Text>
            <Text>{new Date().getFullYear()}</Text>
          </Container>
        </Container>
      </Container>
    </StyledFooter>
  )
}

export default React.memo(MobileFooter)
