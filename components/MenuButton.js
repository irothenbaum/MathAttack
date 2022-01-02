import React from 'react'
import {Pressable, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import {spaceLarge, spaceSmall} from '../styles/layout'
import {neonBlue, dimmedBlue} from '../styles/colors'
import {getBackgroundColor, getUIColor} from '../lib/utilities'
import isDarkMode from '../hooks/isDarkMode'
import UIText from './UIText'

function MenuButton(props) {
  const isDark = isDarkMode()

  return (
    <Pressable
      style={[
        styles.primary,
        {
          color: getUIColor(isDark),
          backgroundColor: isDark ? dimmedBlue : neonBlue,
        },
      ]}
      onPress={props.onPress}>
      <UIText style={{color: getBackgroundColor(isDark)}}>{props.title}</UIText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  primary: {
    padding: spaceSmall,
    paddingHorizontal: spaceLarge,
    borderRadius: 4,
  },
})

MenuButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
}

export default MenuButton
