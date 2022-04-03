import React from 'react'
import {Pressable, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import {spaceDefault, spaceSmall} from '../styles/layout'
import {
  neonBlue,
  dimmedBlue,
  dimmedRed,
  neonRed,
  dimmedGreen,
  neonGreen,
  dimmedMagenta,
  neonMagenta,
  darkGrey,
  grey,
} from '../styles/colors'
import {getBackgroundColor} from '../lib/utilities'
import isDarkMode from '../hooks/isDarkMode'
import UIText from './UIText'
import {font1, font2, font3, font4} from '../styles/typography'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'

function MenuButton(props) {
  const isDark = isDarkMode()

  const size = props.size || MenuButton.SIZE_DEFAULT
  const variant = props.variant || MenuButton.VARIANT_DEFAULT

  let bgColor
  if (props.isDisabled) {
    bgColor = isDark ? darkGrey : grey
  } else {
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
  }

  const canPress = typeof props.onPress === 'function' && !props.isDisabled && !props.isLoading
  const textColor = getBackgroundColor(isDark)

  return (
    <Pressable
      style={[
        styles.primary,
        {
          backgroundColor: bgColor,
          justifyContent: props.icon ? 'flex-start' : 'center',
        },
        props.style,
      ]}
      onPress={canPress ? props.onPress : () => {}}>
      {props.isLoading ? (
        <FontAwesomeIcon icon={faSpinner} transform={{rotate: 90}} {/*TODO: Rotate*/} />
      ) : (
        <React.Fragment>
          {props.icon && (
            <FontAwesomeIcon
              color={textColor}
              icon={props.icon}
              style={styles.icon}
              size={size}
            />
          )}
          <UIText style={{color: textColor, fontSize: size}}>
            {props.title}
          </UIText>
        </React.Fragment>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  primary: {
    padding: spaceSmall,
    paddingHorizontal: spaceDefault,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spaceDefault,
  },
})

MenuButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  variant: PropTypes.string,
  size: PropTypes.number,
  icon: PropTypes.any,
  style: PropTypes.any,
  isLoading: PropTypes.bool,
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
