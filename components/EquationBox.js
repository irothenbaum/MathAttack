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
import {
  selectClassicGameSettings,
  selectEquationDuration,
} from '../redux/selectors'
import {useSelector} from 'react-redux'
import {darkGrey, lightGrey, neonRed} from '../styles/colors'
import {font4} from '../styles/typography'
import {spaceDefault, spaceLarge} from '../styles/layout'
import {zeroPad} from '../lib/utilities'

function generatePlaceholderText(gameSettings) {
  let numberOfDigits = ('' + gameSettings.maxValue).length
  let zeroPadded = zeroPad(0, numberOfDigits)
  return `${zeroPadded} - ${zeroPadded}`
}

function EquationBox(props) {
  const shrinkAnim = useRef(new Animated.Value(0)).current
  const equationDuration = useSelector(selectEquationDuration)
  const gameSettings = useSelector(selectClassicGameSettings)
  const placeholder = useRef(generatePlaceholderText(gameSettings)).current

  useEffect(() => {
    if (!props.timeRemaining || props.timeRemaining < 0) {
      Animated.timing(shrinkAnim).stop()
      shrinkAnim.setValue(0)
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

  const textComponent = props.equationStr ? (
    <Text style={styles.equationText}>{props.equationStr}</Text>
  ) : (
    <Text style={styles.equationTextPlaceholder}>{placeholder}</Text>
  )

  return (
    <TouchableOpacity onPress={() => props.onPress()}>
      <Animated.View style={[styles.box, props.style]}>
        {textComponent}
        {!!props.equationStr && (
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
        )}
      </Animated.View>
    </TouchableOpacity>
  )
}

const equationText = {
  fontSize: font4,
  lineHeight: font4,
  color: darkGrey,
  zIndex: 2,
  margin: spaceDefault,
  marginHorizontal: spaceLarge,
}

const styles = StyleSheet.create({
  box: {
    ...RoundBox,
    zIndex: 2,
    padding: 0,
    overflow: 'hidden',
  },

  equationText: {
    ...equationText,
  },

  equationTextPlaceholder: {
    ...equationText,
    color: lightGrey,
  },

  timerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 4,
    backgroundColor: neonRed,
  },
})

EquationBox.propTypes = {
  equationStr: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  onTimeout: PropTypes.func.isRequired,
  timeRemaining: PropTypes.number,
  style: PropTypes.any,
}

export default EquationBox
