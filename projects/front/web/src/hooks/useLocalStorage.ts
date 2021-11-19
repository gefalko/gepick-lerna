import { useState } from 'react'
import printlog from '@gepick/utils/src/printlog'

function useLocalStorage<T>(key: string, initialValue: T): [T, (newValue: T) => void] {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      printlog(error)
      return initialValue
    }
  })

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      printlog(error)
    }
  }

  return [storedValue, setValue]
}

export default useLocalStorage
