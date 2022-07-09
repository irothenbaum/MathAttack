import React from 'react'
import {Animated, StyleSheet} from 'react-native'
import {titleText} from '../styles/typography'
import {getUIColor} from '../lib/utilities'
import useDarkMode from '../hooks/useDarkMode'

const styles = StyleSheet.create({
  text: {
    ...titleText,
  },
})

function TitleText(props) {
  const isDark = useDarkMode()
  return <Animated.Text style={[styles.text, {color: getUIColor(isDark)}, props.style]}>{props.children}</Animated.Text>
}

export default TitleText
