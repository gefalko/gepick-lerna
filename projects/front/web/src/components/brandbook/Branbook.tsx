import React, { useMemo, CSSProperties } from 'react'
import { colors } from '@gepick/assets/styles/cssVariables'

const fontWeights = {
  regular: 400,
  medium: 500,
  bold: 700,
  boldest: 900,
}

const StyleSheet = {
  bold: {
    fontWeight: fontWeights.bold,
  },
  h2: {
    fontWeight: fontWeights.bold,
    fontSize: '20px',
  },
  h3: {
    fontWeight: fontWeights.bold,
    fontSize: '16px',
  },
  small: {
    fontSize: '12px',
  },
}

interface IProps {
  type?: keyof typeof StyleSheet
  color?: keyof typeof colors
}

const Brandbook: React.FunctionComponent<IProps> = (props) => {
  const { type, color } = props
  const style: CSSProperties = useMemo(() => {
    const brandbookStyle = type ? StyleSheet[type] : {}

    return {
      color: color ? colors[color] : undefined,
      ...brandbookStyle,
    }
  }, [type, color])

  return <span style={style}>{props.children}</span>
}

export default Brandbook
