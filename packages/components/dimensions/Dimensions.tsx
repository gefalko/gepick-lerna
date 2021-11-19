import React, { useRef, useEffect, useState, CSSProperties } from 'react'
import useWindowWidth from '../hooks/useWindowWidth'

interface IProps {
  children: (width: number, height: number) => React.ReactNode
}
interface IState {
  width: number
  height: number
}

const containerStyle: CSSProperties = { width: '100%', height: '100%' }

const Dimensions: React.FunctionComponent<IProps> = (props) => {
  const [state, setState] = useState<IState>({
    width: 0,
    height: 0,
  })
  const ref = useRef<HTMLDivElement>(null)
  const windowWidth = useWindowWidth()

  useEffect(() => {
    if (ref.current) {
      const width = ref.current.clientWidth
      const height = ref.current.clientHeight
      setState((prevState) => ({ ...prevState, width, height }))
    }
  }, [ref, windowWidth])

  return (
    <div style={containerStyle} ref={ref}>
      {props.children(state.width, state.height)}
    </div>
  )
}

export default Dimensions
