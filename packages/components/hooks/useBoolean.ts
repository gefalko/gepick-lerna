import { useState } from 'react'

function useBoolean(b?: boolean): [boolean, () => void, () => void] {
  const [state, setState] = useState<boolean>(b ?? false)

  const setTrue = () => {
    setState(true)
  }

  const setFalse = () => {
    setState(false)
  }

  return [state, setTrue, setFalse]
}

export default useBoolean
