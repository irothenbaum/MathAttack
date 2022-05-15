import useDoOnceTimer from './useDoOnceTimer'
import {useEffect, useState, useRef} from 'react'
import {getRandomString} from '../lib/utilities'

/**
 * @param {number} startTime -- kinda hacky way to get it default a return for secondsRemaining before it's started
 * @return {{secondsRemaining: number, startCountdown: function}}
 */
function useCountdown(startTime) {
  const [hasStarted, setHasStarted] = useState(false)
  const secondsRemaining = useRef(startTime || 0)
  const callback = useRef()
  const {setTimer, cancelTimer} = useDoOnceTimer()
  const timerKey = useRef(getRandomString())

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
    secondsRemaining.current = seconds
    callback.current = onComplete
    setHasStarted(true)
    setTimer(timerKey.current, tickTimer, 1000)
  }

  useEffect(() => {
    const key = timerKey.current
    return () => {
      cancelTimer(key)
    }
  }, [])

  return {
    hasStarted: hasStarted,
    secondsRemaining: secondsRemaining.current,
    startCountdown: startCountdown,
  }
}

export default useCountdown
