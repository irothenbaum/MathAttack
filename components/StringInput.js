import React from 'react'
import {TextInput, StyleSheet, View} from 'react-native'
import PropTypes from 'prop-types'
import NormalText from './NormalText'
import isDarkMode from '../hooks/isDarkMode'
import {getUIColor} from '../lib/utilities'
import {InputStyles} from '../styles/elements'

function StringInput(props) {
  const isDark = isDarkMode()

  return (
    <View style={[styles.container, props.style]}>
      <NormalText style={styles.label}>{props.label}</NormalText>
      <View style={[styles.inputFrame, {borderColor: getUIColor(isDark)}]}>
        <TextInput
          style={[styles.input, {color: getUIColor(isDark)}]}
          value={typeof props.value === 'string' ? props.value : ''}
          onChangeText={props.onChange}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create(InputStyles)

StringInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
}

export default StringInput
