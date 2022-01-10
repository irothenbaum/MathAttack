import React from 'react'
import {Animated, StyleSheet} from 'react-native'
import {uiText} from '../styles/typography'
import {getUIColor} from '../lib/utilities'
import isDarkMode from '../hooks/isDarkMode'
import PropTypes from 'prop-types'

const styles = StyleSheet.create({
  text: {
    ...uiText,
  },
})

function UIText(props) {
  return (
    <Animated.Text
      style={[styles.text, {color: getUIColor(isDarkMode())}, props.style]}>
      {props.children}
    </Animated.Text>
  )
}

UIText.propTypes = {
  style: PropTypes.any,
}

export default UIText
