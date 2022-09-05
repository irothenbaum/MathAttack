import React, {useCallback, useState} from 'react'
import {StyleSheet, Animated, Pressable} from 'react-native'
import PropTypes from 'prop-types'
import {RoundBox} from '../../styles/elements'
import {useDispatch, useSelector} from 'react-redux'
import {setAnswer} from '../../redux/UISlice'
import {selectUserInput} from '../../redux/selectors'
import {OPACITY_AMOUNT} from '../../styles/colors'
import UIText from '../UIText'
import useAnimationStation from '../../hooks/useAnimationStation'
import {SOUND_TAP} from '../../lib/SoundHelper'
import useSoundPlayer from '../../hooks/useSoundPlayer'
import useColorsControl from '../../hooks/useColorsControl'

export const TINT_DURATION = 300
export const DECIMAL = -1
export const CLEAR = -2

function CalculatorButton(props) {
  const {backgroundTint, green} = useColorsControl()

  const dispatch = useDispatch()
  const userInput = useSelector(selectUserInput)
  const {animation, isAnimating, animate} = useAnimationStation()
  const {playSound} = useSoundPlayer()

  let valueStr = props.value === DECIMAL ? '•' : props.value === CLEAR ? 'CLR' : `${props.value}`

  const handlePress = useCallback(() => {
    playSound(SOUND_TAP).then()
    animate(TINT_DURATION)

    if (props.value === CLEAR) {
      dispatch(setAnswer(''))
    } else if (props.value === 0 && userInput === '0') {
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
  }, [props.value, dispatch, userInput, animate])

  const isDisabled =
    (props.value === DECIMAL && userInput.includes('.')) || (typeof props.value === 'number' && props.value >= 0 && userInput === '0')

  const bgColor = isDisabled ? backgroundTint : 'transparent'

  return (
    <Pressable style={[styles.pressable]} disabled={isDisabled || props.isDisabled} onPress={handlePress}>
      <Animated.View
        style={[
          styles.container,
          props.style,
          {
            backgroundColor: isAnimating
              ? animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [green, bgColor],
                })
              : bgColor,
          },
        ]}
      >
        <UIText>{valueStr}</UIText>
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  container: {
    ...RoundBox,
    borderRadius: 0,
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
