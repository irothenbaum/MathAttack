import React, {useCallback} from 'react'
import {TouchableOpacity, Text, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import {RoundBox} from '../../styles/elements'
import {useDispatch, useSelector} from 'react-redux'
import {setAnswer} from '../../redux/UISlice'
import {selectUserInput} from '../../redux/selectors'
import {darkGrey, grey} from '../../styles/colors'
import {fontHeader} from '../../styles/typography'

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
    } else {
      let toAppend = props.value === DECIMAL ? '.' : props.value
      let newAnswer = userInput + toAppend

      if (isNaN(parseFloat(newAnswer))) {
        // do nothing
        return
      }

      dispatch(setAnswer(newAnswer))
    }
  }, [props.value, dispatch, userInput])

  const isDisabled = props.value === DECIMAL && userInput.includes('.')

  return (
    <TouchableOpacity
      style={{...styles.container, ...props.style}}
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
  number: {
    color: darkGrey,
    fontSize: fontHeader,
  },
  numberDisabled: {
    color: grey,
    fontSize: fontHeader,
  },
})

CalculatorButton.propTypes = {
  value: PropTypes.number.isRequired,
  style: PropTypes.any,
}

export default CalculatorButton
