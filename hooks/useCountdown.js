import doOnceTimer from './doOnceTimer'
import {useEffect, useState, useRef} from 'react'

/**
 * @param {number} seconds
 * @param {function} onComplete
 * @return {{secondsRemaining: number, startCountdown: function}}
 */
function useCountdown(seconds, onComplete) {
  const [hasStarted, setHasStarted] = useState(false)
  const secondsRemaining = useRef(seconds + 1)
  const {setTimer, cancelTimer} = doOnceTimer()
  const timerKey = useRef(Math.random().toString(36).substr(2))

  const tickTimer = () => {
    secondsRemaining.current = secondsRemaining.current - 1

    if (secondsRemaining.current > 0) {
      setTimer(timerKey.current, tickTimer, 1000)
    } else if (typeof onComplete === 'function') {
      onComplete()
      cancelTimer(timerKey.current)
    }
  }

  const startCountdown = () => {
    if (hasStarted) {
      return
    }
    setHasStarted(true)
    tickTimer()
  }

  useEffect(() => {
    const key = timerKey.current
    return () => {
      cancelTimer(key)
    }
  }, [])

  return {
    secondsRemaining: Math.min(secondsRemaining.current, seconds),
    startCountdown: startCountdown,
  }
}

export default useCountdown
