import { useState } from 'react'

function useSwitch(initState?: boolean): [boolean, () => void] {
  const [state, setState] = useState<boolean>(initState ?? false)

  const switchState = () => {
    setState(!state)
  }

  return [state, switchState]
}

export default useSwitch
