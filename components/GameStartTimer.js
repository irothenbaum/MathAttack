import React, {useEffect, useState, useRef} from 'react'
import {Animated, View, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import UIText from './UIText'
import doOnceTimer from '../hooks/doOnceTimer'
import {FullScreenOverlay, TextShadowSoft} from '../styles/elements'
import {shadow, sunbeam, white} from '../styles/colors'
import {spaceExtraLarge} from '../styles/layout'
import randomColor from '../hooks/randomColor'
import {getBackgroundColor} from '../lib/utilities'
import isDarkMode from '../hooks/isDarkMode'
import animationStation from '../hooks/animationStation'

function GameStartTimer(props) {
  const isDark = isDarkMode()
  const secondsRemaining = useRef(4)
  const {color, randomizeColor} = randomColor()
  const {setTimer, cancelAllTimers} = doOnceTimer()
  const {animate, animation} = animationStation()

  const tickTimer = () => {
    if (secondsRemaining.current > 1) {
      randomizeColor()
      animate(1000)
      setTimer('game-start-countdown', tickTimer, 1000)
    } else if (typeof props.onStart === 'function') {
      props.onStart()
    }

    secondsRemaining.current = secondsRemaining.current - 1
  }

  useEffect(() => {
    tickTimer()

    return () => {
      cancelAllTimers()
    }
  }, [])

  if (secondsRemaining.current <= 0) {
    return null
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: animation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [color, color, getBackgroundColor(isDark)],
          }),
        },
      ]}>
      <UIText
        style={[
          styles.counterText,
          {
            color: getBackgroundColor(isDark),
            textShadowColor: isDark ? sunbeam : shadow,
          },
        ]}>
        {secondsRemaining.current}
      </UIText>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...FullScreenOverlay,
    zIndex: 15,
  },
  counterText: {
    fontSize: 72,
    marginBottom: spaceExtraLarge,
    ...TextShadowSoft,
  },
})

GameStartTimer.propTypes = {
  onStart: PropTypes.func,
}

export default GameStartTimer
