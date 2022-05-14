import useDoOnceTimer from './useDoOnceTimer'
import {useEffect, useState, useRef} from 'react'

/**
 * @return {{secondsRemaining: number, startCountdown: function}}
 */
function useCountdown() {
  const [hasStarted, setHasStarted] = useState(false)
  const secondsRemaining = useRef(0)
  const callback = useRef()
  const {setTimer, cancelTimer} = useDoOnceTimer()
  const timerKey = useRef(Math.random().toString(36).substr(2))

  const tickTimer = () => {
    secondsRemaining.current = secondsRemaining.current - 1

    if (secondsRemaining.current > 0) {
      setTimer(timerKey.current, tickTimer, 1000)
    } else if (typeof callback.current === 'function') {
      callback.current()
      cancelTimer(timerKey.current)
    }
  }

  /**
   * @param {number} seconds
   * @param {function?} onComplete
   */
  const startCountdown = (seconds, onComplete) => {
    if (hasStarted) {
      return
    }
    secondsRemaining.current = seconds + 1
    callback.cuurrent = onComplete
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
    secondsRemaining: secondsRemaining.current,
    startCountdown: startCountdown,
  }
}

export default useCountdown
