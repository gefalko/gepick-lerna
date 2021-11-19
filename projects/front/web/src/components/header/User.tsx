import React from 'react'
import styled from 'styled-components'
import { Dropdown, Menu } from 'antd'
import Container from '@gepick/components/container/Container'
import useMe from 'hooks/useMe'
import Text from '@gepick/components/text/Text'
import { colors } from '@gepick/assets/styles/cssVariables'
import useOpenAuthModal from 'components/authModal/useOpenAuthModal'

const StyledLink = styled.a`
  color: ${colors.white};

  &:hover {
    color: ${colors.yellow};
  }
`

interface IProps {
  onLogoutClick: () => void
}

const User: React.FunctionComponent<IProps> = (props) => {
  const [me, meLoading] = useMe()
  const openAuthModal = useOpenAuthModal()

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a onClick={props.onLogoutClick}>logout</a>
      </Menu.Item>
    </Menu>
  )

  return (
    <Container>
      {!meLoading && !me && (
        <Text>
          <StyledLink onClick={openAuthModal}>login</StyledLink>
        </Text>
      )}
      {!meLoading && me && (
        <Dropdown overlay={menu} trigger={['click']}>
          <Text>
            <StyledLink>
              {me.fullName ?? me.email}
              <Container width="5px" inline />
              <img
                style={{ borderRadius: '50%' }}
                width="30px"
                src={
                  me.thumbUrl ??
                  'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
                }
                alt="profile thumb"
              />
            </StyledLink>
          </Text>
        </Dropdown>
      )}
    </Container>
  )
}

export default User
