import React from 'react'
import {TextInput, StyleSheet, View} from 'react-native'
import PropTypes from 'prop-types'
import NormalText from './NormalText'
import {InputStyles} from '../styles/elements'
import useColorsControl from '../hooks/useColorsControl'

function StringInput(props) {
  const {foreground} = useColorsControl()

  return (
    <View style={[styles.container, props.style]}>
      <NormalText style={styles.label}>{props.label}</NormalText>
      <View style={[styles.inputFrame, {borderColor: foreground}]}>
        <TextInput
          style={[styles.input, {color: foreground}]}
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
