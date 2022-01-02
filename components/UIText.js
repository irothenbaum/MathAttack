import React from 'react'
import {Text, StyleSheet} from 'react-native'
import {uiText} from '../styles/typography'
import {getUIColor} from '../lib/utilities'
import isDarkMode from '../hooks/isDarkMode'

const styles = StyleSheet.create({
  text: {
    ...uiText,
  },
})

function UIText(props) {
  return (
    <Text style={[styles.text, {color: getUIColor(isDarkMode())}, props.style]}>
      {props.children}
    </Text>
  )
}

export default UIText
