import React, {useEffect, useRef} from 'react'
import {Animated, Pressable, View, StyleSheet} from 'react-native'
import useAnimationStation from '../hooks/useAnimationStation'
import PropTypes from 'prop-types'
import UIText from './UIText'
import {getUIColor} from '../lib/utilities'
import isDarkMode from '../hooks/isDarkMode'
import {black, darkGrey, dimmedRed, grey, lightGrey, middleGrey, neonRed, white} from '../styles/colors'

const containerBorderWidth = 2
const toggleSize = 40

const OFF_LEFT = -containerBorderWidth
const ON_LEFT = toggleSize + containerBorderWidth

const SLIDE_DURATION = 200
const RAIL_ON_OPACITY = 0.25

function BooleanInput(props) {
  const isDark = isDarkMode()
  const {animate, animation, isAnimating} = useAnimationStation()
  const previousValue = useRef(props.value)

  useEffect(() => {
    if (props.value === previousValue.current) {
      return
    }

    previousValue.current = props.value
    animate(SLIDE_DURATION)
  }, [props.value])

  const onHandleColor = isDark ? dimmedRed : neonRed
  const offHandleColor = isDark ? black : white
  const containerColor = isDark ? darkGrey : lightGrey
  const containerBorderColor = isDark ? grey : middleGrey

  return (
    <View style={styles.container}>
      <Pressable onPress={() => props.onChange(!props.value)}>
        <View style={[styles.toggleContainer, {backgroundColor: containerColor, borderColor: containerBorderColor}]}>
          <Animated.View
            style={[
              styles.railHighlight,
              {
                backgroundColor: onHandleColor,
                opacity: isAnimating
                  ? animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: previousValue.current ? [0, RAIL_ON_OPACITY] : [RAIL_ON_OPACITY, 0],
                    })
                  : previousValue.current // we want to use props.value, but it thrashes because props.value changes first, then we call animate
                  ? RAIL_ON_OPACITY
                  : 0,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.toggleHandle,
              {
                backgroundColor: isAnimating
                  ? animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: previousValue.current ? [offHandleColor, onHandleColor] : [onHandleColor, offHandleColor],
                    })
                  : previousValue.current
                  ? onHandleColor
                  : offHandleColor,
                left: isAnimating
                  ? animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: previousValue.current ? [OFF_LEFT, ON_LEFT] : [ON_LEFT, OFF_LEFT],
                    })
                  : previousValue.current // we want to use props.value, but it thrashes because props.value changes first, then we call animate
                  ? ON_LEFT
                  : OFF_LEFT,
              },
            ]}
          />
        </View>
        {!!props.label && <UIText>{props.label}</UIText>}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  toggleContainer: {
    width: toggleSize * 2,
    height: toggleSize,
    borderRadius: toggleSize / 2,
    borderWidth: containerBorderWidth,
  },
  toggleHandle: {
    position: 'absolute',
    width: toggleSize,
    height: toggleSize,
    borderRadius: toggleSize / 2,
    borderWidth: containerBorderWidth,
    left: 0,
    top: -containerBorderWidth,
    zIndex: 5,
  },
  railHighlight: {
    position: 'absolute',
    zIndex: 3,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: toggleSize / 2,
  },
})

BooleanInput.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
}

export default BooleanInput
