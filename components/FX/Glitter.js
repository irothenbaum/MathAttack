import React, {useState} from 'react'
import {View, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import Particle from '../../models/Particle'
import ParticleSprite from './ParticleSprite'

function Glitter(props) {
  const [glits, setGlits] = useState(
    new Array(props.amount).map(() => Particle.generateRandom(props.duration)),
  )

  const handleParticleEnd = p => {
    setGlits(glits.filter(g => g.id !== p.id))
  }

  return (
    <View style={styles.root}>
      {glits.map(g => (
        <ParticleSprite
          key={g.id}
          particle={g}
          onAnimationEnd={handleParticleEnd}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
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
