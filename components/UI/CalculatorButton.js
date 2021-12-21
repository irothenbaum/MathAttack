import React, {useCallback} from 'react'
import {TouchableOpacity, Text, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import {RoundBox} from '../../styles/elements'
import {useDispatch, useSelector} from 'react-redux'
import {setAnswer} from '../../redux/UISlice'
import {selectUserInput} from '../../redux/selectors'
import {darkGrey, grey, lightGrey} from '../../styles/colors'
import {font3} from '../../styles/typography'

export const DECIMAL = -1
export const CLEAR = -2

function CalculatorButton(props) {
  const dispatch = useDispatch()
  const userInput = useSelector(selectUserInput)

  let valueStr =
    props.value === DECIMAL
      ? '•'
      : props.value === CLEAR
      ? 'CLR'
      : `${props.value}`

  const handlePress = useCallback(() => {
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

  return (
    <TouchableOpacity
      style={{
        ...(isDisabled ? styles.containerDisabled : styles.container),
        ...props.style,
      }}
      disabled={isDisabled}
      onPress={handlePress}>
      <Text style={isDisabled ? styles.numberDisabled : styles.number}>
        {valueStr}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    ...RoundBox,
  },
  containerDisabled: {
    ...RoundBox,
    backgroundColor: lightGrey,
  },
  number: {
    color: darkGrey,
    fontSize: font3,
  },
  numberDisabled: {
    color: grey,
    fontSize: font3,
  },
})

CalculatorButton.propTypes = {
  value: PropTypes.number.isRequired,
  style: PropTypes.any,
}

export default CalculatorButton
