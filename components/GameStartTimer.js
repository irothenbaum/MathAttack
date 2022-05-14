import React, {useEffect, useState} from 'react'
import {Animated, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import UIText from './UIText'
import {FullScreenOverlay, TextShadowSoft} from '../styles/elements'
import {shadow, sunbeam, neonRed, dimmedRed} from '../styles/colors'
import {spaceExtraLarge} from '../styles/layout'
import {getBackgroundColor} from '../lib/utilities'
import isDarkMode from '../hooks/isDarkMode'
import useAnimationStation from '../hooks/useAnimationStation'
import useCountdown from '../hooks/useCountdown'

function GameStartTimer(props) {
  const [timerFinished, setTimerFinished] = useState(false)
  const isDark = isDarkMode()
  const [color, setColor] = useState(isDark ? dimmedRed : neonRed)
  const {animate, animation} = useAnimationStation()
  const {secondsRemaining, startCountdown} = useCountdown()

  useEffect(() => {
    startCountdown(3, () => {
      setTimerFinished(true)
      props.onStart()
    })
  }, [])

  useEffect(() => {
    setColor(isDark ? dimmedRed : neonRed)
    animate(1000)
  }, [secondsRemaining])

  if (timerFinished) {
    return null
  }

  const bGColor = getBackgroundColor(isDark)

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [color, bGColor],
          }),
        },
      ]}>
      <UIText
        style={[
          styles.counterText,
          {
            color: bGColor,
            textShadowColor: isDark ? sunbeam : shadow,
          },
        ]}>
        {secondsRemaining}
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
