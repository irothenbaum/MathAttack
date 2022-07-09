import React, {useEffect, useRef} from 'react'
import {Animated, Pressable, View, StyleSheet} from 'react-native'
import useAnimationStation from '../hooks/useAnimationStation'
import PropTypes from 'prop-types'
import UIText from './UIText'
import {getUIColor} from '../lib/utilities'
import useDarkMode from '../hooks/useDarkMode'
import {black, darkGrey, dimmedRed, grey, lightGrey, middleGrey, neonRed, white} from '../styles/colors'
import {font2} from '../styles/typography'
import {spaceDefault} from '../styles/layout'
import Icon from './Icon'

const containerBorderWidth = 2
const toggleSize = 40

const OFF_LEFT = -containerBorderWidth
const ON_LEFT = toggleSize + containerBorderWidth

const SLIDE_DURATION = 200
const RAIL_ON_OPACITY = 0.25

function BooleanInput(props) {
  const isDark = useDarkMode()
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
    <View style={props.style}>
      <Pressable onPress={() => props.onChange(!props.value)} style={styles.container}>
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
                borderColor: getUIColor(isDark),
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
          >
            {props.icon ? <Icon icon={props.icon} style={styles.icon} size={font2} /> : undefined}
          </Animated.View>
        </View>
        {!!props.label && <UIText style={{fontSize: font2}}>{props.label}</UIText>}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    opacity: 0.8,
  },
  toggleContainer: {
    width: toggleSize * 2,
    height: toggleSize,
    borderRadius: toggleSize / 2,
    borderWidth: containerBorderWidth,
    marginRight: spaceDefault,
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
    alignItems: 'center',
    justifyContent: 'center',
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
  style: PropTypes.any,
  icon: PropTypes.any,
}

export default BooleanInput
