import React from 'react'
import {TextInput, StyleSheet, View} from 'react-native'
import PropTypes from 'prop-types'
import {font3} from '../styles/typography'
import NormalText from './NormalText'
import isDarkMode from '../hooks/isDarkMode'
import {spaceDefault} from '../styles/layout'
import {getUIColor} from '../lib/utilities'

function NumberInput(props) {
  const isDark = isDarkMode()

  const handleChange = valStr => {
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
      <View style={[styles.inputFrame, {borderColor: getUIColor(isDark)}]}>
        <TextInput
          style={[styles.input, {color: getUIColor(isDark)}]}
          value={typeof props.value === 'number' ? '' + props.value : ''}
          keyboardType={'numeric'}
          onChangeText={handleChange}
          onBlur={() => handleChange(props.value || props.min)}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spaceDefault,
  },
  input: {
    fontSize: font3,
  },
  label: {
    opacity: 0.5,
  },
  inputFrame: {
    borderWidth: 1,
    borderRadius: 4,
  },
})

NumberInput.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
}

export default NumberInput
