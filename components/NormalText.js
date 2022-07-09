import React from 'react'
import {Text, StyleSheet} from 'react-native'
import {normalText} from '../styles/typography'
import {getUIColor} from '../lib/utilities'
import useDarkMode from '../hooks/useDarkMode'
import PropTypes from 'prop-types'

const styles = StyleSheet.create({
  text: {
    ...normalText,
  },
})

function NormalText(props) {
  const isDark = useDarkMode()
  return (
    <Text style={[styles.text, {color: getUIColor(isDark)}, props.style]} onPress={props.onPress}>
      {props.children}
    </Text>
  )
}

NormalText.propTypes = {
  style: PropTypes.any,
  onPress: PropTypes.func,
}

export default NormalText
