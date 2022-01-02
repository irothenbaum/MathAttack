import React from 'react'
import {Text, StyleSheet} from 'react-native'
import {titleText} from '../styles/typography'
import {getUIColor} from '../lib/utilities'
import isDarkMode from '../hooks/isDarkMode'

const styles = StyleSheet.create({
  text: {
    ...titleText,
  },
})

function TitleText(props) {
  return (
    <Text style={[styles.text, {color: getUIColor(isDarkMode())}, props.style]}>
      {props.children}
    </Text>
  )
}

export default TitleText
