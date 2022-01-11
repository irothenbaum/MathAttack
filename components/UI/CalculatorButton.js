import React, {useCallback, useState} from 'react'
import {StyleSheet, Animated, Pressable} from 'react-native'
import PropTypes from 'prop-types'
import {RoundBox} from '../../styles/elements'
import {useDispatch, useSelector} from 'react-redux'
import {setAnswer} from '../../redux/UISlice'
import {selectUserInput} from '../../redux/selectors'
import {
  darkGrey,
  lightGrey,
  OPACITY_AMOUNT,
  transparent,
} from '../../styles/colors'
import UIText from '../UIText'
import {getUIColor} from '../../lib/utilities'
import isDarkMode from '../../hooks/isDarkMode'
import animationStation from '../../hooks/animationStation'
import randomColor from '../../hooks/randomColor'

export const TINT_DURATION = 300
export const DECIMAL = -1
export const CLEAR = -2

const getBackgroundColor = (isDark, isDisabled) => {
  return isDisabled ? (isDark ? darkGrey : lightGrey) : transparent
}

function CalculatorButton(props) {
  const isDark = isDarkMode()
  const dispatch = useDispatch()
  const userInput = useSelector(selectUserInput)
  const {animation, isAnimating, animate} = animationStation()
  const {color: tintColor, randomizeColor} = randomColor()

  let valueStr =
    props.value === DECIMAL
      ? '•'
      : props.value === CLEAR
      ? 'CLR'
      : `${props.value}`

  const handlePress = useCallback(() => {
    randomizeColor()
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
  }, [props.value, dispatch, userInput, animate, randomizeColor])

  const isDisabled = props.value === DECIMAL && userInput.includes('.')

  const textColor = getUIColor(isDark)

  return (
    <Pressable
      disabled={isDisabled || props.isDisabled}
      onPress={handlePress}
      style={[
        styles.container,
        props.style,
        {backgroundColor: getBackgroundColor(isDark, isDisabled)},
      ]}>
      <UIText
        style={{
          color: isAnimating
            ? animation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [tintColor, tintColor, textColor],
              })
            : textColor,
        }}>
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
  isDisabled: PropTypes.bool,
}

export default CalculatorButton
