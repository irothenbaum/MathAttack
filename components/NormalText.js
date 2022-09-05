import React from 'react'
import {Text, StyleSheet} from 'react-native'
import {normalText} from '../styles/typography'
import PropTypes from 'prop-types'
import useColorsControl from '../hooks/useColorsControl'

const styles = StyleSheet.create({
  text: {
    ...normalText,
  },
})

function NormalText(props) {
  const {foreground} = useColorsControl()
  return (
    <Text style={[styles.text, {color: foreground}, props.style]} onPress={props.onPress}>
      {props.children}
    </Text>
  )
}

NormalText.propTypes = {
  style: PropTypes.any,
  onPress: PropTypes.func,
}

export default NormalText
