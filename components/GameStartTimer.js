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
import {SOUND_BEEP, SOUND_START} from '../lib/SoundHelper'
import useSoundPlayer from '../hooks/useSoundPlayer'

const START_TIME = 3

function GameStartTimer(props) {
  const [timerFinished, setTimerFinished] = useState(false)
  const isDark = isDarkMode()
  const [color, setColor] = useState(isDark ? dimmedRed : neonRed)
  const {animate, animation} = useAnimationStation()
  const {hasStarted, secondsRemaining, startCountdown} = useCountdown()
  const {playSound} = useSoundPlayer()

  useEffect(() => {
    startCountdown(START_TIME, () => {
      playSound(SOUND_START).then()
      setTimerFinished(true)
      props.onStart()
    })
  }, [])

  useEffect(() => {
    setColor(isDark ? dimmedRed : neonRed)
    if (secondsRemaining > 0) {
      playSound(SOUND_BEEP).then()
    }
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
      ]}
    >
      <UIText
        style={[
          styles.counterText,
          {
            color: bGColor,
            textShadowColor: isDark ? sunbeam : shadow,
          },
        ]}
      >
        {hasStarted ? secondsRemaining : START_TIME}
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
