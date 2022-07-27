import React from 'react'
import {Animated, StyleSheet, View} from 'react-native'
import useDarkMode from '../../hooks/useDarkMode'
import PropTypes from 'prop-types'
import {getBackgroundColor, getResultColor} from '../../lib/utilities'
import {FullScreenOverlay} from '../../styles/elements'

function GameBackground({animation, isAnimatingForCorrect}) {
  const isDark = useDarkMode()
  const defaultBGColor = getBackgroundColor(isDark)

  return (
    <View style={[styles.container, {backgroundColor: defaultBGColor}]}>
      {!!animation && (
        <Animated.View
          style={[
            styles.celebrationBG,
            {
              backgroundColor: getResultColor(isAnimatingForCorrect, isDark),
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
