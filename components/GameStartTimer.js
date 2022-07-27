import React, {useEffect} from 'react'
import {Animated, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import UIText from './UIText'
import {BoxShadow, FullScreenOverlay, TextShadowSoft} from '../styles/elements'
import {shadow, sunbeam, neonRed, dimmedRed} from '../styles/colors'
import {spaceDefault, spaceExtraLarge} from '../styles/layout'
import {getBackgroundColor} from '../lib/utilities'
import useDarkMode from '../hooks/useDarkMode'
import useAnimationStation from '../hooks/useAnimationStation'
import useCountdown from '../hooks/useCountdown'
import {SOUND_BEEP, SOUND_START} from '../lib/SoundHelper'
import useSoundPlayer from '../hooks/useSoundPlayer'

const START_TIME = 3

function GameStartTimer(props) {
  const isDark = useDarkMode()
  const {animate, animation} = useAnimationStation()
  const {hasStarted, secondsRemaining, startCountdown} = useCountdown()
  const {playSound} = useSoundPlayer()

  const color = isDark ? dimmedRed : neonRed
  useEffect(() => {
    if (global.skipOnDev) {
      props.onStart()
    } else {
      startCountdown(START_TIME)
    }
  }, [])

  useEffect(() => {
    if (secondsRemaining > 0) {
      playSound(SOUND_BEEP).then()
      animate(1000)
    } else if (hasStarted) {
      playSound(SOUND_START).then()
      props.onStart()
    }
  }, [secondsRemaining])

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
            backgroundColor: bGColor,
            color: color,
            textShadowColor: isDark ? sunbeam : shadow,
          },
        ]}
      >
        {hasStarted ? (secondsRemaining > 0 ? secondsRemaining : '') : START_TIME}
      </UIText>
    </Animated.View>
  )
}

const circleSize = 120

const styles = StyleSheet.create({
  container: {
    ...FullScreenOverlay,
    zIndex: 15,
  },
  counterText: {
    height: circleSize,
    width: circleSize,
    alignItems: 'center',
    lineHeight: circleSize,
    borderRadius: circleSize / 2,
    fontSize: 72,
    textAlign: 'center',
    ...BoxShadow,
    ...TextShadowSoft,
  },
})

GameStartTimer.propTypes = {
  onStart: PropTypes.func,
}

export default GameStartTimer
