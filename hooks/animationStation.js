import React, {useState, useRef, useEffect} from 'react'
import {Animated, Easing} from 'react-native'

function animationStation(startAnimating) {
  const [isAnimating, setIsAnimating] = useState(false)
  const animation = useRef(new Animated.Value(0)).current

  // stop animating on unmount
  useEffect(() => {
    if (startAnimating) {
      animate()
    }

    return () => {
      Animated.timing(animation).stop()
    }
  }, [])

  /**
   * @param {number} duration
   * @param {function?} onComplete
   * @param {func} easing
   * @param {number?} startValue -- between (0-1]
   */
  const animate = (duration, onComplete, easing, startValue = 0) => {
    if (typeof startValue === 'number' && startValue >= 1) {
      console.error('Start value must be less than 1, received: ' + startValue)
      if (typeof onComplete === 'function') {
        onComplete()
      }
      return
    }

    setIsAnimating(true)
    animation.setValue(startValue)
    Animated.timing(animation, {
      toValue: 1,
      duration: duration,
      easing: easing || Easing.in(Easing.linear),
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) {
        setIsAnimating(false)
        if (typeof onComplete === 'function') {
          onComplete()
        }
      }
    })
  }

  const cancel = () => {
    setIsAnimating(false)
    Animated.timing(animation).stop()
  }

  return {
    animate,
    cancel,
    isAnimating,
    animation,
  }
}

export default animationStation
