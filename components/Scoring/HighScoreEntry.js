import useColorsControl from '../../hooks/useColorsControl'
import {Easing, Pressable, StyleSheet, Animated} from 'react-native'
import {fadeColor, formatNumber} from '../../lib/utilities'
import NormalText from '../NormalText'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, {useEffect} from 'react'
import {spaceDefault, spaceSmall} from '../../styles/layout'
import Icon, {Expand} from '../Icon'
import {font1} from '../../styles/typography'
import useAnimationStation from '../../hooks/useAnimationStation'

const LOOP_DURATION = 1000

/**
 * @param {{result: GameResult}} props
 */
function HighScoreEntry(props) {
  const {loop, isAnimating, animation} = useAnimationStation()
  const {foreground, blue, shadowLight, green, background} = useColorsControl()
  const textColor = foreground

  useEffect(() => {
    if (props.isHighlighted) {
      loop(LOOP_DURATION, Easing.out(Easing.linear))
    }
  }, [])

  const bgColor = props.place % 2 === 0 ? shadowLight : background

  return (
    <Pressable onPress={props.onPress}>
      <Animated.View
        style={[
          styles.scoreEntryContainer,
          {
            backgroundColor:
              isAnimating && !!animation
                ? animation.interpolate({inputRange: [0, 0.5, 1], outputRange: [bgColor, fadeColor(green, 0.3), bgColor]})
                : bgColor,
          },
        ]}
      >
        <NormalText style={[styles.recordText, {width: '10%', color: textColor}]}>{props.place}.</NormalText>
        <NormalText style={[styles.recordText, {color: textColor}]}>
          {moment(props.result.dateCreated).format('YYYY-MM-DD, h:mm a')}
        </NormalText>
        <NormalText style={[styles.scoreText, {color: textColor}]}>{formatNumber(props.result.finalScore)}</NormalText>
        <Icon icon={Expand} color={blue} size={font1} style={styles.expandIcon} />
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  scoreEntryContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spaceDefault,
    paddingHorizontal: spaceSmall,
  },

  recordText: {
    fontSize: 14,
  },

  scoreText: {
    textAlign: 'right',
    fontWeight: 'bold',
    flex: 1,
  },

  expandIcon: {
    marginLeft: spaceSmall,
  },
})

HighScoreEntry.propTypes = {
  result: PropTypes.object.isRequired,
  isHighlighted: PropTypes.bool,
  onPress: PropTypes.func,
}

export default HighScoreEntry
