import React from 'react'
import {Animated, StyleSheet} from 'react-native'
import {uiText} from '../styles/typography'
import PropTypes from 'prop-types'
import useColorsControl from '../hooks/useColorsControl'

const styles = StyleSheet.create({
  text: {
    ...uiText,
  },
})

function UIText(props) {
  const {foreground} = useColorsControl()
  return (
    <Animated.Text onLayout={props.onLayout} style={[styles.text, {color: foreground}, props.style]}>
      {props.children}
    </Animated.Text>
  )
}

UIText.propTypes = {
  style: PropTypes.any,
  onLayout: PropTypes.func,
}

export default UIText
