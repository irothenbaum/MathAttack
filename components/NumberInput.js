import React from 'react'
import {TextInput, StyleSheet, View} from 'react-native'
import PropTypes from 'prop-types'
import NormalText from './NormalText'
import {InputStyles} from '../styles/elements'
import useColorsControl from '../hooks/useColorsControl'

function NumberInput(props) {
  const {foreground} = useColorsControl()

  const handleChange = (valStr) => {
    let val = parseInt(valStr)
    if (isNaN(val)) {
      val = null
    } else {
      if (typeof props.max === 'number') {
        val = Math.min(props.max, val)
      }
      if (typeof props.min === 'number') {
        val = Math.max(props.min, val)
      }
    }

    props.onChange(val)
  }

  return (
    <View style={[styles.container, props.style]}>
      <NormalText style={styles.label}>{props.label}</NormalText>
      <View style={[styles.inputFrame, {borderColor: foreground}]}>
        <TextInput
          style={[styles.input, {color: foreground}]}
          value={typeof props.value === 'number' ? '' + props.value : ''}
          keyboardType={'numeric'}
          onChangeText={handleChange}
          onBlur={() => handleChange(props.value || props.min)}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create(InputStyles)

NumberInput.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  label: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
}

export default NumberInput
