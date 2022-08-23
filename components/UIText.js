import React from 'react'
import {Animated, StyleSheet} from 'react-native'
import {uiText} from '../styles/typography'
import {getUIColor} from '../lib/utilities'
import useDarkMode from '../hooks/useDarkMode'
import PropTypes from 'prop-types'

const styles = StyleSheet.create({
  text: {
    ...uiText,
  },
})

function UIText(props) {
  const isDark = useDarkMode()
  return (
    <Animated.Text onLayout={props.onLayout} style={[styles.text, {color: getUIColor(isDark)}, props.style]}>
      {props.children}
    </Animated.Text>
  )
}

UIText.propTypes = {
  style: PropTypes.any,
  onLayout: PropTypes.func,
}

export default UIText
