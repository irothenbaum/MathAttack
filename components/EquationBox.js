import React, {useEffect, useRef} from 'react'
import {Animated, View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import GameQuestion from '../models/GameQuestion'
import {RoundBox} from '../styles/elements'
import {selectEquationDuration} from '../redux/selectors'
import {useSelector} from 'react-redux'
import {darkGrey, neonRed} from '../styles/colors'
import {fontHeader, fontTitle} from '../styles/typography'
import {spaceDefault, spaceLarge, spaceSmall} from '../styles/layout'

function EquationBox(props) {
  const shrinkAnim = useRef(new Animated.Value(0)).current
  const equationDuration = useSelector(selectEquationDuration)

  useEffect(() => {
    shrinkAnim.setValue(1 - props.question.getMSRemaining() / equationDuration)
    Animated.timing(shrinkAnim, {
      toValue: 1,
      duration: props.question.getMSRemaining(),
    }).start(() => props.onTimeout(props.question))
  }, [props, shrinkAnim, equationDuration])

  return (
    <TouchableOpacity onPress={() => props.onPress(props.question)}>
      <View style={styles.box}>
        <Text style={styles.equationText}>
          {props.question ? props.question.equation.getLeftSide() : ''}
        </Text>
        <Animated.View
          style={[
            styles.timerBar,
            {
              width: shrinkAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['100%', '0%'],
              }),
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  box: {
    ...RoundBox,
    zIndex: 2,
    padding: 0,
    overflow: 'hidden',
  },

  equationText: {
    fontSize: fontTitle,
    lineHeight: fontTitle,
    color: darkGrey,
    zIndex: 2,
    margin: spaceDefault,
    marginHorizontal: spaceLarge,
  },

  timerBar: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: neonRed,
  },
})

EquationBox.propTypes = {
  question: PropTypes.instanceOf(GameQuestion),
  onPress: PropTypes.func.isRequired,
  onTimeout: PropTypes.func.isRequired,
}

export default EquationBox
