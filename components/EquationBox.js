import React from 'react'
import {Animated, StyleSheet, View} from 'react-native'
import PropTypes from 'prop-types'
import {RoundBox} from '../styles/elements'
import {font4} from '../styles/typography'
import {spaceDefault, spaceLarge} from '../styles/layout'
import TitleText from './TitleText'
import {formatNumber} from '../lib/utilities'
import Phrase from '../models/Phrase'
import useColorsControl from '../hooks/useColorsControl'

function EquationBox(props) {
  const {red, foreground} = useColorsControl()
  const textComponent = props.equation ? (
    <View style={styles.longFormContainer}>
      <TitleText style={styles.operationText}>{props.equation.phrase.operation}</TitleText>
      <View>
        <TitleText style={styles.equationText}>{formatNumber(Phrase.defineTerm(props.equation.phrase.term1))}</TitleText>
        <TitleText style={styles.equationText}>{formatNumber(Phrase.defineTerm(props.equation.phrase.term2))}</TitleText>
      </View>
    </View>
  ) : null

  return (
    <Animated.View style={[styles.box, props.style]}>
      {textComponent}
      <View style={[styles.equalBar, {backgroundColor: foreground}]} />
      {!!props.timerAnimation && (
        <Animated.View
          style={[
            styles.equalBar,
            {
              backgroundColor: red,
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
  lineHeight: font4,
  zIndex: 2,
  marginBottom: spaceDefault,
  marginHorizontal: spaceLarge,
  textAlign: 'right',
}

const styles = StyleSheet.create({
  box: {
    ...RoundBox,
    zIndex: 2,
    padding: 0,
    overflow: 'hidden',
  },

  longFormContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  equationText: {
    ...equationText,
  },

  operationText: {
    ...equationText,
    textAlign: 'left',
  },

  equalBar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100%',
    height: 4,
  },
})

EquationBox.propTypes = {
  equation: PropTypes.object,
  timerAnimation: PropTypes.object,
  style: PropTypes.object,
}

export default EquationBox
