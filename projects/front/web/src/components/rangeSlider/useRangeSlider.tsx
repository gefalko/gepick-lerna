import React, { useMemo, useCallback, ReactNode } from 'react'
import { Slider } from 'antd'
import useUrlParamState from '@gepick/components/hooks/useUrlParamState'

interface IProps {
  fromName: string
  fromDefaultValue: string
  toName: string
  toDefaultValue: string
  min?: number
  max?: number
}

function useSliderRange(props: IProps): [number, number, ReactNode] {
  const [fromString, setFrom] = useUrlParamState(props.fromName, props.fromDefaultValue)
  const [toString, setTo] = useUrlParamState(props.toName, props.toDefaultValue)

  const from = parseInt(fromString ?? props.fromDefaultValue, 10)
  const to = parseInt(toString ?? props.toDefaultValue, 10)

  const handleChange = useCallback(
    (value) => {
      const [newFrom, newTo] = value

      setFrom(newFrom)
      setTo(newTo)
    },
    [setFrom, setTo],
  )

  const rangeComponent = useMemo(() => {
    return <Slider min={props.min} max={props.max} onAfterChange={handleChange} range defaultValue={[from, to]} />
  }, [from, to, handleChange, props.min, props.max])

  return [from, to, rangeComponent]
}

export default useSliderRange
