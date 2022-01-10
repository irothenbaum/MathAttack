import React from 'react'
import {Animated, StyleSheet, View} from 'react-native'
import {dimmedGreen, dimmedRed, neonGreen, neonRed} from '../../styles/colors'
import isDarkMode from '../../hooks/isDarkMode'
import PropTypes from 'prop-types'
import {getBackgroundColor} from '../../lib/utilities'
import {FullScreenOverlay} from '../../styles/elements'

const getAnimationColor = (isAnimatingForCorrect, isDark) => {
  return isAnimatingForCorrect
    ? isDark
      ? dimmedGreen
      : neonGreen
    : isDark
    ? dimmedRed
    : neonRed
}

function GameBackground({animation, isAnimatingForCorrect}) {
  const isDark = isDarkMode()
  const defaultBGColor = getBackgroundColor(isDarkMode())

  return (
    <View style={[styles.container, {backgroundColor: defaultBGColor}]}>
      {!!animation && (
        <Animated.View
          style={[
            styles.celebrationBG,
            {
              backgroundColor: getAnimationColor(isAnimatingForCorrect, isDark),
              opacity: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            },
          ]}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...FullScreenOverlay,
    alignItems: 'center',
    justifyContent: 'center',
  },

  celebrationBGRipple: {
    padding: 0,
    margin: 0,
  },

  celebrationBG: {
    ...FullScreenOverlay,
  },
})

GameBackground.propTypes = {
  isAnimatingForCorrect: PropTypes.bool,
  animation: PropTypes.any,
}

export default GameBackground
