import React, {useState, useEffect, useRef} from 'react'
import {View, Animated} from 'react-native'
import PropTypes from 'prop-types'
import Particle from '../../models/Particle'

const GRAVITY = 1

function ParticleSprite(props) {
  const particleAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(particleAnim, {
      toValue: 1,
      duration: props.particle.duration,
      useNativeDriver: false,
    }).start(() => {
      props.onAnimationEnd(props.particle)
    })
  })

  const durationSeconds = props.particle.duration/1000

  return (
    <Animated.View style={[
      {
        left: particleAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, durationSeconds * props.particle.speed],
        }),
        top: particleAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, durationSeconds * GRAVITY]
        }),
        opacity: particleAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1, 0]
        })
      }
    ]} />
  )
}

ParticleSprite.propTypes = {
  particle: PropTypes.instanceOf(Particle).isRequired,
  onAnimationEnd: PropTypes.func.isRequired
}

export default ParticleSprite