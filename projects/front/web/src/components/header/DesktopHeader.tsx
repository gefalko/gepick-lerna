import React from 'react'
import styled from 'styled-components'
import { Layout } from 'antd'
import Logo from '@gepick/components/logo/Logo'
import Container from '@gepick/components/container/Container'
import { desktopHeaderStyles, desktopBodyStyles } from '@gepick/assets/styles/cssVariables'
import TopNaviagtion from './TopNavigation'
import User from './User'
import Partner from './Partner'

const StyledHeader = styled(Layout.Header)`
  &.ant-layout-header {
    background: ${desktopHeaderStyles.backgroundColor};
    height: ${desktopHeaderStyles.height};
    line-height: ${desktopHeaderStyles.height};
    padding: 0 ${desktopBodyStyles.contentPadding};
    position: fixed;
    width: 100%;
    z-index: 1000;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.24);
  }

  .content {
    height: ${desktopHeaderStyles.height};
  }
`

interface IProps {
  onLogoutClick: () => void
}

const DesktopHeader: React.FunctionComponent<IProps> = (props) => {
  return (
    <>
      <StyledHeader>
        <Container justifyContentSpaceBetween>
          <Container className="content" alignItemsCenter>
            <Container justifyContentSpaceBetween marginTop={10}>
              <Logo />
            </Container>
            <Container marginLeft={40}>
              <TopNaviagtion />
            </Container>
          </Container>
          <Container flex>
            <User onLogoutClick={props.onLogoutClick} />
            <Partner />
          </Container>
        </Container>
      </StyledHeader>
      <Container height={desktopHeaderStyles.height} />
    </>
  )
}

export default DesktopHeader
