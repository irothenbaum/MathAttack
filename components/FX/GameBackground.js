import React from 'react'
import {Animated, StyleSheet, View} from 'react-native'
import PropTypes from 'prop-types'
import {FullScreenOverlay} from '../../styles/elements'
import useColorsControl from '../../hooks/useColorsControl'

function GameBackground({animation, isAnimatingForCorrect}) {
  const {getResultColor, background} = useColorsControl()

  return (
    <View style={[styles.container, {backgroundColor: background}]}>
      {!!animation && (
        <Animated.View
          style={[
            styles.celebrationBG,
            {
              backgroundColor: getResultColor(isAnimatingForCorrect),
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
