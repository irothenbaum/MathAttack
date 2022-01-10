import React from 'react'
import {Text, StyleSheet} from 'react-native'
import {normalText} from '../styles/typography'
import {getUIColor} from '../lib/utilities'
import isDarkMode from '../hooks/isDarkMode'
import PropTypes from 'prop-types'

const styles = StyleSheet.create({
  text: {
    ...normalText,
  },
})

function NormalText(props) {
  return (
    <Text
      style={[styles.text, {color: getUIColor(isDarkMode())}, props.style]}
      onPress={props.onPress}>
      {props.children}
    </Text>
  )
}

NormalText.propTypes = {
  style: PropTypes.any,
  onPress: PropTypes.func,
}

export default NormalText
