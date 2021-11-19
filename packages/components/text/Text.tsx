import React from 'react'

interface IProps {
  marginTop?: number
  minHeight?: number
  marginLeft?: number
  marginRight?: number
  marginBottom?: number
  maxWidth?: string
  padding?: number
  block?: boolean
  textAlignCenter?: boolean
  textAlignRight?: boolean
  textAlignJustify?: boolean
  ellipsis?: boolean
  className?: string
  style?: React.CSSProperties
  cursor?: string
  fullWidth?: boolean
  onClick?: React.MouseEventHandler
}

const Text: React.FunctionComponent<IProps> = (props) => {
  const styles: React.CSSProperties = React.useMemo(
    () => ({
      ...(props.marginTop ? { marginTop: props.marginTop } : {}),
      ...(props.padding ? { padding: props.padding } : {}),
      ...(props.marginBottom ? { marginBottom: props.marginBottom } : {}),
      ...(props.minHeight ? { minHeight: props.minHeight } : {}),
      ...(props.textAlignCenter ? { textAlign: 'center' } : {}),
      ...(props.textAlignJustify ? { textAlign: 'justify' } : {}),
      ...(props.textAlignRight ? { textAlign: 'right' } : {}),
      ...(props.marginRight ? { marginRight: props.marginRight } : {}),
      ...(props.marginLeft ? { marginLeft: props.marginLeft } : {}),
      ...(props.maxWidth ? { maxWidth: props.maxWidth } : {}),
      ...(props.fullWidth ? { width: '100%' } : {}),
      ...(props.style ? props.style : {}),
      ...(props.cursor ? { cursor: props.cursor } : {}),
      ...(props.ellipsis
        ? {
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            display: 'inline-block',
          }
        : {}),
    }),
    [props],
  )

  return props.block ? (
    <div className={props.className} onClick={props.onClick} style={styles}>
      {props.children}
    </div>
  ) : (
    <span className={props.className} onClick={props.onClick} style={styles}>
      {props.children}
    </span>
  )
}

export default Text
