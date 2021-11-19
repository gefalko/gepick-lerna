import React from 'react'

interface IProps {
  src: string
  alt: string
  height?: number
  width?: number
}

const Image: React.FunctionComponent<IProps> = (props) => {
  const height = props.height ? `${props.height}px` : undefined
  const width = props.width ? `${props.width}px` : undefined
  return <img height={height} width={width} src={props.src} alt={props.alt} />
}

export default React.memo(Image)
