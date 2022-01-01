import React, {useRef} from 'react'
import {Animated, Text, StyleSheet, View} from 'react-native'
import PropTypes from 'prop-types'
import {RoundBox} from '../styles/elements'
import {selectClassicGameSettings} from '../redux/selectors'
import {useSelector} from 'react-redux'
import {darkGrey, lightGrey, neonRed} from '../styles/colors'
import {font4} from '../styles/typography'
import {spaceDefault, spaceLarge} from '../styles/layout'
import {zeroPad} from '../lib/utilities'
import Equation from '../models/Equation'

function generatePlaceholderText(gameSettings) {
  let numberOfDigits = ('' + gameSettings.maxValue).length
  let zeroPadded = zeroPad(0, numberOfDigits)
  return `${zeroPadded} - ${zeroPadded}`
}

function EquationBox(props) {
  const gameSettings = useSelector(selectClassicGameSettings)
  const placeholder = useRef(generatePlaceholderText(gameSettings)).current

  const textComponent = props.equation ? (
    <Text style={styles.equationText}>
      {Equation.getLeftSide(props.equation)}
    </Text>
  ) : (
    <Text style={styles.equationTextPlaceholder}>{placeholder}</Text>
  )

  return (
    <Animated.View style={[styles.box, props.style]}>
      {textComponent}
      <View style={styles.equalBar} />
      {!!props.timerAnimation && (
        <Animated.View
          style={[
            styles.equalBar,
            {
              backgroundColor: neonRed,
              width: props.timerAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      )}
    </Animated.View>
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

  equalBar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100%',
    height: 4,
    backgroundColor: darkGrey,
  },
})

EquationBox.propTypes = {
  equation: PropTypes.object,
  timerAnimation: PropTypes.object,
  style: PropTypes.object,
}

export default EquationBox
