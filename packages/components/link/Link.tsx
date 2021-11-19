import React from 'react'
import styled from 'styled-components'

interface IStyledLinkProps {
  underline?: boolean
  color?: string
}

const StyledLink = styled.a<IStyledLinkProps>`
  ${(props) => {
    if (props.underline) {
      return `text-decoration: underline;`
    }

    return ''
  }}

  ${(props) => {
    if (props.color) {
      return `color: ${props.color};`
    }

    return ''
  }}
`

interface IProps {
  href?: string
  color?: string
  targetBlank?: boolean
  children: React.ReactNode
  underline?: boolean
  onClick?: () => void
}

const Link: React.FunctionComponent<IProps> = (props) => {
  const rel = props.targetBlank ? 'noopener noreferrer' : undefined
  const target = props.targetBlank ? '_blank' : undefined
  return (
    <StyledLink
      color={props.color}
      onClick={props.onClick}
      underline={props.underline}
      href={props.href}
      rel={rel}
      target={target}
    >
      {props.children}
    </StyledLink>
  )
}

export default React.memo(Link)
