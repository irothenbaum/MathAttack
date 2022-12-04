import React, {useEffect, useState} from 'react'
import {TextInput, StyleSheet, View} from 'react-native'
import PropTypes from 'prop-types'
import NormalText from './NormalText'
import {InputStyles} from '../styles/elements'
import useColorsControl from '../hooks/useColorsControl'

function NumberInput(props) {
  const [valCache, setValCache] = useState()
  const {foreground} = useColorsControl()

  useEffect(() => {
    setValCache('' + props.value)
  }, [props.value])

  const handleChange = () => {
    let val = parseInt(valCache)
    if (isNaN(val)) {
      val = props.min || props.max
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
          value={valCache}
          keyboardType={'numeric'}
          onChangeText={setValCache}
          onBlur={handleChange}
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
