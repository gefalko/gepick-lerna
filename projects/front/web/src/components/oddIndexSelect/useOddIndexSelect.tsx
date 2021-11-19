import React, { useMemo, useCallback } from 'react'
import { Select } from 'antd'
import useUrlParamState from '@gepick/components/hooks/useUrlParamState'

interface IProps {
  defaultIndex: number
}

const selectStyle = { width: '100%' }

function useOddIndexSelect(props: IProps): [number, React.ReactNode] {
  const [oddIndex, setOddIndex] = useUrlParamState('oddIndex', props.defaultIndex.toString())

  const handleChange = useCallback(
    (value) => {
      setOddIndex(value)
    },
    [setOddIndex],
  )

  const selectComponent = useMemo(() => {
    if (!oddIndex) {
      return null
    }
    return (
      <Select style={selectStyle} value={oddIndex} onChange={handleChange}>
        <Select.Option value="0">best</Select.Option>
        <Select.Option value="1">second</Select.Option>
        <Select.Option value="2">third</Select.Option>
        <Select.Option value="3">fourth</Select.Option>
        <Select.Option value="4">fifth</Select.Option>
      </Select>
    )
  }, [oddIndex, handleChange])

  return [oddIndex ? parseInt(oddIndex, 10) : props.defaultIndex, selectComponent]
}

export default useOddIndexSelect
