import React, {useCallback, useState} from 'react'
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native'
import PropTypes from 'prop-types'
import {RoundBox} from '../../styles/elements'
import {useDispatch, useSelector} from 'react-redux'
import {setAnswer} from '../../redux/UISlice'
import {selectUserInput} from '../../redux/selectors'
import {
  darkGrey,
  DimmedColors,
  lightGrey,
  NeonColors,
  OPACITY_AMOUNT,
  transparent,
  white,
} from '../../styles/colors'
import UIText from '../UIText'
import {getUIColor} from '../../lib/utilities'
import isDarkMode from '../../hooks/isDarkMode'
import animationStation from '../../hooks/animationStation'

export const TINT_DURATION = 300
export const DECIMAL = -1
export const CLEAR = -2

const getBackgroundColor = (isDark, isDisabled) => {
  return isDisabled ? (isDark ? darkGrey : lightGrey) : transparent
}

const getRandomTintColor = isDark => {
  return getBackgroundColor(isDark)

  let options = isDark ? DimmedColors : NeonColors

  return options[Math.floor(Math.random() * options.length)]
}

function CalculatorButton(props) {
  const isDark = isDarkMode()
  const dispatch = useDispatch()
  const userInput = useSelector(selectUserInput)
  const [tintColor, setTintColor] = useState(white)
  const {animation, isAnimating, animate} = animationStation()

  let valueStr =
    props.value === DECIMAL
      ? '•'
      : props.value === CLEAR
      ? 'CLR'
      : `${props.value}`

  const handlePress = useCallback(() => {
    setTintColor(getRandomTintColor(isDark))
    animate(TINT_DURATION)

    if (props.value === CLEAR) {
      dispatch(setAnswer(''))
    } else if (props.value === 0 && !userInput) {
      // no leading 0s
      return
    } else {
      let newAnswer
      if (props.value === DECIMAL) {
        if (!userInput) {
          newAnswer = '0.'
        } else {
          newAnswer = userInput + '.'
        }
      } else {
        newAnswer = userInput + props.value
      }

      dispatch(setAnswer(newAnswer))
    }
  }, [props.value, dispatch, userInput])

  const isDisabled = props.value === DECIMAL && userInput.includes('.')

  const tint = isAnimating && (
    <Animated.View
      style={[
        styles.buttonTint,
        {
          ...RoundBox,
          backgroundColor: tintColor,
          opacity: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 0],
          }),
        },
      ]}
    />
  )

  return (
    <Pressable
      style={[
        styles.container,
        props.style,
        {backgroundColor: getBackgroundColor(isDark, isDisabled)},
      ]}
      disabled={isDisabled}
      onPress={handlePress}>
      {tint}
      <UIText
        style={[
          {color: getUIColor(isDarkMode())},
          isDisabled ? styles.numberDisabled : styles.number,
        ]}>
        {valueStr}
      </UIText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    ...RoundBox,
  },
  buttonTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  number: {},
  numberDisabled: {
    opacity: OPACITY_AMOUNT,
  },
})

CalculatorButton.propTypes = {
  value: PropTypes.number.isRequired,
  style: PropTypes.any,
}

export default CalculatorButton
