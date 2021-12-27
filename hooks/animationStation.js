import React, {useState, useRef} from 'react'
import {Animated, Easing} from 'react-native'

function animationStation() {
  const [isAnimating, setIsAnimating] = useState(false)
  const animation = useRef(new Animated.Value(0)).current

  const animate = (duration, onComplete) => {
    setIsAnimating(true)
    animation.setValue(0)
    Animated.timing(animation, {
      toValue: 1,
      duration: duration,
      easing: Easing.linear,
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
