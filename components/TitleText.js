import React from 'react'
import {Animated, StyleSheet} from 'react-native'
import {titleText} from '../styles/typography'
import useColorsControl from '../hooks/useColorsControl'

const styles = StyleSheet.create({
  text: {
    ...titleText,
  },
})

function TitleText(props) {
  const {foreground} = useColorsControl()
  return <Animated.Text style={[styles.text, {color: foreground}, props.style]}>{props.children}</Animated.Text>
}

export default TitleText
