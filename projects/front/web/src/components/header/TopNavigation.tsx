import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import Container from '@gepick/components/container/Container'
import { colors } from '@gepick/assets/styles/cssVariables'
import routes from 'routes/routes'
import useBreakPoints from '@gepick/components/hooks/useBreakPoints'

interface IStyledMenuItemProps {
  active?: boolean
  compact?: boolean
}

const StyledMenuItem = styled(Container)<IStyledMenuItemProps>`
  a {
    color: ${({ active }) => (active ? colors.yellow : colors.white)};
    display: block;
    ${(props) => {
      if (props.compact) {
        return `padding: 0 5px; front-weight: 500;`
      }

      return `padding: 0 10px; font-weight: 700;`
    }}
    ${(props) => {
      if (props.active) {
        return `border-bottom: 2px solid ${colors.white};`
      }

      return `border-bottom: 2px solid transperent`
    }}
  }
`

interface ICustomLinkProps {
  to: string[]
  compact?: boolean
}

const CustomLink: React.FunctionComponent<ICustomLinkProps> = (props) => {
  const match = useRouteMatch({
    path: props.to,
    exact: true,
  })

  const [link] = props.to

  return (
    <StyledMenuItem compact={props.compact} active={match !== null}>
      <Link to={link}>{props.children}</Link>
    </StyledMenuItem>
  )
}

interface IProps {
  compact?: boolean
}

const TopNaviagtion: React.FunctionComponent<IProps> = (props) => {
  const { isDesktop } = useBreakPoints()

  return (
    <Container flex={isDesktop}>
      <CustomLink compact={props.compact} to={[routes.profitablePicksPage]}>
        Profitable picks
      </CustomLink>
      <CustomLink compact={props.compact} to={[routes.picksExplorerPage]}>
        Picks explorer
      </CustomLink>
      <CustomLink compact={props.compact} to={[routes.predictions]}>
        Predictions
      </CustomLink>
      <CustomLink compact={props.compact} to={[routes.botExplorer]}>
        Bot explorer
      </CustomLink>
      <CustomLink compact={props.compact} to={[routes.studio]}>
        Bot developer studio
      </CustomLink>
      <CustomLink compact={props.compact} to={[routes.bookmakerExplorer, routes.bookmakerExplorerIntervalReportPage]}>
        Bookmaker explorer
      </CustomLink>
      <CustomLink compact={props.compact} to={[routes.aboutUs]}>
        About us
      </CustomLink>
    </Container>
  )
}

export default TopNaviagtion
