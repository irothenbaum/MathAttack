import React, {useEffect, useRef, useReducer} from 'react'
import {View, StyleSheet, Animated} from 'react-native'
import TitleText from './TitleText'
import useThemedAsset from '../hooks/useThemedAsset'
import PropTypes from 'prop-types'
import {screenWidth} from '../styles/layout'
import {getVibrateStylesForAnimation} from '../lib/utilities'

const typeformWidth = screenWidth * 0.65
const SLAM_STEP = 0.9
const rotationDeg = '-10deg'

const finalTitle = 'math,'

const TitleTypeform = React.forwardRef((props, ref) => {
  const {Component, path} = useThemedAsset('attack_typeform.svg')
  const titleText = useRef('')
  const forceUpdate = useReducer(bool => !bool)[1]

  useEffect(() => {
    if (props.animation) {
      const interval = setInterval(() => {
        if (titleText.current === finalTitle) {
          clearInterval(interval)
        }
        titleText.current = finalTitle.substr(0, titleText.current.length + 1)
        forceUpdate()
      }, 100)
    } else {
      titleText.current = finalTitle
    }
  }, [])

  return (
    <Animated.View
      style={[
        styles.container,
        props.style,
        props.animation
          ? getVibrateStylesForAnimation(props.animation, SLAM_STEP)
          : undefined,
      ]}
      ref={ref}>
      <TitleText>{titleText.current}</TitleText>
      <Animated.View
        style={[
          styles.typeFormContainer,
          {
            transform: [{rotateZ: rotationDeg}],
          },
          props.animation
            ? {
                opacity: props.animation
                  ? props.animation.interpolate({
                      inputRange: [0, 0.7, SLAM_STEP, 1],
                      outputRange: [0, 0, 1, 1],
                    })
                  : 1,
                transform: [
                  {
                    rotateZ: props.animation.interpolate({
                      inputRange: [0.5, SLAM_STEP, 1],
                      outputRange: ['40deg', rotationDeg, rotationDeg],
                    }),
                  },
                  {
                    scale: props.animation.interpolate({
                      inputRange: [0.5, SLAM_STEP, 1],
                      outputRange: [8, 1, 1],
                    }),
                  },
                ],
              }
            : undefined,
        ]}>
        <Component width={typeformWidth} height={typeformWidth * 0.3} />
      </Animated.View>
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  container: {
    width: typeformWidth * 1.1,
    height: typeformWidth / 1.6,
  },
  typeFormContainer: {
    position: 'absolute',
    top: 40,
    right: 0,
  },
})

TitleTypeform.displayName = 'TitleTypeform'
TitleTypeform.propTypes = {
  animation: PropTypes.instanceOf(Animated.Value),
  style: PropTypes.any,
  onLayout: PropTypes.func,
}

export default TitleTypeform
