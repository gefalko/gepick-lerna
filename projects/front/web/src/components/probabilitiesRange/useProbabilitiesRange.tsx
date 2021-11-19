import React, { useMemo, useCallback, ReactNode } from 'react'
import { Slider } from 'antd'
import useUrlParamState from '@gepick/components/hooks/useUrlParamState'

function useProbabilitiesRange(): [number, number, ReactNode] {
  const [fromProbabilityString, setFromProbability] = useUrlParamState('probabilityFrom', '70')
  const [toProbabilityString, setToProbability] = useUrlParamState('probabilityTo', '100')

  const fromProbability = fromProbabilityString ? parseInt(fromProbabilityString, 10) : 70
  const toProbability = toProbabilityString ? parseInt(toProbabilityString, 10) : 100

  const handleChange = useCallback(
    (value) => {
      const [newFrom, newTo] = value

      setFromProbability(newFrom)
      setToProbability(newTo)
    },
    [setFromProbability, setToProbability],
  )

  const probabilitiesRangeComponent = useMemo(() => {
    return <Slider onAfterChange={handleChange} range defaultValue={[fromProbability, toProbability]} />
  }, [fromProbability, toProbability, handleChange])

  return [fromProbability, toProbability, probabilitiesRangeComponent]
}

export default useProbabilitiesRange
