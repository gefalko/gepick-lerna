import React from 'react'
import styled from 'styled-components'
import { Layout } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import Logo from '@gepick/components/logo/Logo'
import Container from '@gepick/components/container/Container'
import { mobileHeaderStyles, mobileBodyStyles } from '@gepick/assets/styles/cssVariables'
import useSwitch from '@gepick/components/hooks/useSwitch'
import TopNaviagtion from './TopNavigation'
import User from './User'

const StyledHeader = styled(Layout.Header)`
  &.ant-layout-header {
    background: ${mobileHeaderStyles.backgroundColor};
    height: ${mobileHeaderStyles.height};
    line-height: ${mobileHeaderStyles.height};
    padding: 0 ${mobileBodyStyles.contentPadding};
    position: fixed;
    width: 100%;
    z-index: 1000;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.24);
  }

  .content {
    height: ${mobileHeaderStyles.height};
  }
`

const StyledMenuContainer = styled(Container)`
  position: absolute;
  width: 100%;
  height: calc(100% - ${mobileHeaderStyles.height});
  z-index: 1000;
  top: ${mobileHeaderStyles.height};
`

const StyledMenuSider = styled(Container)`
  background-color: ${mobileHeaderStyles.backgroundColor};
  width: 200px;
  height: 100%;
`

const menuIconStyle = {
  fontSize: 24,
  color: '#fff',
}

interface IProps {
  onLogoutClick: () => void
}

const MobileHeader: React.FunctionComponent<IProps> = (props) => {
  const [menuVisible, openHideMenu] = useSwitch()

  return (
    <>
      <StyledHeader>
        <Container className="content" justifyContentSpaceBetween>
          <Container flex>
            <Container paddingTop={7}>
              <MenuOutlined onClick={openHideMenu} style={menuIconStyle} />
            </Container>
            <Container width={10} />
            <Container paddingTop={10}>
              <Logo />
            </Container>
          </Container>
          <Container>
            <User onLogoutClick={props.onLogoutClick} />
          </Container>
        </Container>
      </StyledHeader>
      <Container height={mobileHeaderStyles.height} />
      {menuVisible && (
        <StyledMenuContainer onClick={openHideMenu}>
          <StyledMenuSider paddingTop={20}>
            <TopNaviagtion />
          </StyledMenuSider>
        </StyledMenuContainer>
      )}
    </>
  )
}

export default MobileHeader
