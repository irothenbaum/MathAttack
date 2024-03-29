import React, {useEffect, useState} from 'react'
import {View, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import useColorsControl from '../../hooks/useColorsControl'
import {selectRandom} from '../../lib/utilities'
import UIText from '../UIText'
import useAnimationStation from '../../hooks/useAnimationStation'
import {font3} from '../../styles/typography'
import {spaceExtraSmall, spaceSmall} from '../../styles/layout'
import {BoxShadow} from '../../styles/elements'

const REACTIONS = ['Awesome!', 'Nice!', 'Spot on!', 'Bingo!', 'Too easy!', 'Yes!', 'Perfect!', 'Genius!']

function AnswerReaction(props) {
  const {orange, green, red, magenta, yellow, blue, background, shadow} = useColorsControl()
  const [reaction, setReaction] = useState('')
  const {animate, isAnimating, animation} = useAnimationStation()
  const [color, setColor] = useState(orange)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    setReaction(selectRandom(REACTIONS))
    setColor(selectRandom([orange, green, red, magenta, yellow, blue]))
    setRotation(selectRandom(40) - 20)
    animate(props.duration)
  }, [props.duration])

  return (
    <View style={styles.reactionContainer}>
      <UIText
        style={[
          styles.reaction,
          {
            transform: [{rotateZ: `${rotation}deg`}],
            backgroundColor: color,
            color: background,
            marginTop: isAnimating
              ? animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, -30],
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
    ...BoxShadow,
    paddingHorizontal: spaceSmall,
    paddingVertical: spaceExtraSmall,
    borderRadius: 4,
    fontWeight: 'bold',
    fontSize: font3,
  },
})

AnswerReaction.propTypes = {
  duration: PropTypes.number,
}

export default AnswerReaction
