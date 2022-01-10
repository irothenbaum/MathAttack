import React from 'react'
import {Pressable, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import {spaceLarge, spaceSmall} from '../styles/layout'
import {
  neonBlue,
  dimmedBlue,
  dimmedRed,
  neonRed,
  dimmedGreen,
  neonGreen,
  dimmedMagenta,
  neonMagenta,
} from '../styles/colors'
import {getBackgroundColor} from '../lib/utilities'
import isDarkMode from '../hooks/isDarkMode'
import UIText from './UIText'
import {font1, font2, font3, font4} from '../styles/typography'

function MenuButton(props) {
  const isDark = isDarkMode()

  const size = props.size || MenuButton.SIZE_DEFAULT
  const variant = props.variant || MenuButton.VARIANT_DEFAULT

  let bgColor
  switch (variant) {
    case MenuButton.VARIANT_DESTRUCTIVE:
      bgColor = isDark ? dimmedRed : neonRed
      break

    case MenuButton.VARIANT_SECONDARY:
      bgColor = isDark ? dimmedMagenta : neonMagenta
      break

    case MenuButton.VARIANT_AFFIRMATIVE:
      bgColor = isDark ? dimmedGreen : neonGreen
      break

    case MenuButton.VARIANT_DEFAULT:
    default:
      bgColor = isDark ? dimmedBlue : neonBlue
      break
  }

  return (
    <Pressable
      style={[
        styles.primary,
        {
          backgroundColor: bgColor,
        },
      ]}
      onPress={props.onPress}>
      <UIText style={{color: getBackgroundColor(isDark), fontSize: size}}>
        {props.title}
      </UIText>
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
  variant: PropTypes.string,
  size: PropTypes.number,
}

MenuButton.SIZE_X_LARGE = font4
MenuButton.SIZE_LARGE = font3
MenuButton.SIZE_DEFAULT = font2
MenuButton.SIZE_SMALL = font1

MenuButton.VARIANT_DEFAULT = 'default'
MenuButton.VARIANT_AFFIRMATIVE = 'affirmative'
MenuButton.VARIANT_DESTRUCTIVE = 'destructive'
MenuButton.VARIANT_SECONDARY = 'secondary'

export default MenuButton
