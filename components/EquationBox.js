import React, {useEffect, useRef} from 'react'
import {
  Animated,
  Easing,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import PropTypes from 'prop-types'
import {RoundBox} from '../styles/elements'
import {selectEquationDuration} from '../redux/selectors'
import {useSelector} from 'react-redux'
import {darkGrey, neonRed} from '../styles/colors'
import {font4} from '../styles/typography'
import {spaceDefault, spaceLarge} from '../styles/layout'

function EquationBox(props) {
  const shrinkAnim = useRef(new Animated.Value(0)).current
  const equationDuration = useSelector(selectEquationDuration)

  useEffect(() => {
    if (!props.timeRemaining) {
      return
    }
    let value = props.timeRemaining / equationDuration

    shrinkAnim.setValue(value)

    Animated.timing(shrinkAnim, {
      toValue: 0,
      duration: props.timeRemaining,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) {
        props.onTimeout()
      }
    })
  }, [props.timeRemaining, equationDuration, shrinkAnim, props.onTimeout])

  return (
    <TouchableOpacity onPress={() => props.onPress()}>
      <View style={styles.box}>
        <Text style={styles.equationText}>{props.equationStr}</Text>
        <Animated.View
          style={[
            styles.timerBar,
            {
              width: shrinkAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
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
    fontSize: font4,
    lineHeight: font4,
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
  equationStr: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  onTimeout: PropTypes.func.isRequired,
  timeRemaining: PropTypes.number,
}

export default EquationBox
