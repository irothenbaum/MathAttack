import React, {useEffect, useState} from 'react'
import {Animated, View, StyleSheet, Text} from 'react-native'
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
import Icon, {OperationAdd, OperationDivide, OperationMultiply, OperationSubtract} from './Icon'

const START_TIME = 3

const icons = [OperationMultiply, OperationAdd, OperationDivide, OperationSubtract]

/**
 * @returns {number}
 */
function getRandomIconIndex(previousIndex) {
  let nextIndex

  do {
    nextIndex = Math.floor(Math.random() * icons.length)
  } while (nextIndex === previousIndex)

  return nextIndex
}

function GameStartTimer(props) {
  const isDark = useDarkMode()
  const {animate, animation} = useAnimationStation()
  const {hasStarted, secondsRemaining, startCountdown} = useCountdown()
  const {playSound} = useSoundPlayer()
  const [iconIndex, setIconIndex] = useState(getRandomIconIndex())

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
      setIconIndex((iconIndex + 1) % icons.length)
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
      <View style={styles.backgroundIcon}>
        <Icon icon={icons[iconIndex]} color={bGColor} size={400} />
      </View>
      <UIText
        style={[
          styles.counterText,
          {
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

const styles = StyleSheet.create({
  container: {
    ...FullScreenOverlay,
    zIndex: 15,
  },
  backgroundIcon: {
    position: 'absolute',
    top: 0,
    left: -200,
    right: -200,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    zIndex: 5,
    alignItems: 'center',
    fontSize: 72,
    textAlign: 'center',
    ...TextShadowSoft,
  },
})

GameStartTimer.propTypes = {
  onStart: PropTypes.func,
}

export default GameStartTimer
