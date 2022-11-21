import React, {useEffect, useState} from 'react'
import {View, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import useColorsControl from '../../hooks/useColorsControl'
import {selectRandom} from '../../lib/utilities'
import UIText from '../UIText'
import useAnimationStation from '../../hooks/useAnimationStation'
import {font4} from '../../styles/typography'

const REACTIONS = ['Awesome!', 'Nice!', 'Spot on!', 'Bingo!', 'Too easy!', 'Yes!', 'Perfect!', 'Genius!']

function AnswerReaction(props) {
  const {orange, shadow} = useColorsControl()
  const [reaction, setReaction] = useState('')
  const {animate, isAnimating, animation} = useAnimationStation()

  useEffect(() => {
    setReaction(selectRandom(REACTIONS))
    animate(props.duration)
  }, [props.duration])

  return (
    <View style={styles.reactionContainer}>
      <UIText
        style={[
          styles.reaction,
          {
            textShadowColor: shadow,
            transform: [{rotateZ: `-15deg`}],
            color: orange,
            marginTop: isAnimating
              ? animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, -20],
                })
              : 0,
            opacity: isAnimating
              ? animation.interpolate({
                  inputRange: [0, 0.8, 1],
                  outputRange: [1, 1, 0],
                })
              : 0,
          },
        ]}
      >
        {reaction}
      </UIText>
    </View>
  )
}

const styles = StyleSheet.create({
  reactionContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  reaction: {
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 10,
    fontWeight: 'bold',
    fontSize: font4,
  },
})

AnswerReaction.propTypes = {
  duration: PropTypes.number,
}

export default AnswerReaction
