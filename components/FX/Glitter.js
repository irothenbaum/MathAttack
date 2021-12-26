import React, {useState} from 'react'
import {View, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import Particle from '../../models/Particle'
import RenderFX from './RenderFX'
import ParticleSprite from './ParticleSprite'

function Glitter(props) {
  const [glits] = useState(
    [...new Array(props.amount)].map(
      () => new ParticleSprite(Particle.generateRandom(props.duration)),
    ),
  )

  return (
    <View style={styles.root}>
      <RenderFX renderables={glits} />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'rgba(0, 255, 0, 1)', // for testing purposes
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
})

Glitter.propTypes = {
  amount: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
}

export default Glitter
