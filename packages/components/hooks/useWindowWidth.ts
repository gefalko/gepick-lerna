import { useState, useEffect } from 'react'

const getWidth = () => {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
}

function useWindowWidth() {
  const [width, setWidth] = useState<number>(getWidth())

  useEffect(() => {
    let timeoutId: number | null = null
    const resizeListener = () => {
      if (timeoutId != null) {
        clearTimeout(timeoutId)
      }
      timeoutId = window.setTimeout(() => setWidth(getWidth()), 100)
    }
    window.addEventListener('resize', resizeListener)

    return () => {
      window.removeEventListener('resize', resizeListener)
    }
  }, [])

  return width
}

export default useWindowWidth
