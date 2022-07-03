import React, {useEffect, useRef} from 'react'
import {Animated, Pressable, StyleSheet, View} from 'react-native'
import PropTypes from 'prop-types'
import {spaceDefault, spaceSmall} from '../styles/layout'
import {dimmedRed, neonRed, darkGrey, grey, black, white} from '../styles/colors'
import {getFlashStylesForAnimation, getOutOfFocusStylesForAnimation, getRandomString, getUIColor} from '../lib/utilities'
import isDarkMode from '../hooks/isDarkMode'
import UIText from './UIText'
import {font1, font2, font3, font4} from '../styles/typography'
import useAnimationStation from '../hooks/useAnimationStation'
import useDoOnceTimer from '../hooks/useDoOnceTimer'
import {SOUND_BUTTON_BEEP, SOUND_BUTTON_CHIME} from '../lib/SoundHelper'
import Icon, {Loading} from './Icon'
import useSoundPlayer from '../hooks/useSoundPlayer'

function ButtonShadow(props) {
  return (
    <Animated.View
      style={{
        height: '100%',
        width: '100%',
        position: 'absolute',
        borderColor: props.color,
        borderWidth: 1,
        borderRadius: props.fontSize,
        backgroundColor: 'transparent',

        ...props.animationStyle,
      }}
    />
  )
}

const BLUR_DURATION = 1000
const BLUR_DELAY = 1000
const PRESS_DELAY = 500

function MenuButton(props) {
  const {animate, animation, cancel} = useAnimationStation()
  const {setTimer} = useDoOnceTimer()
  const blurKey = useRef(getRandomString())
  const isDark = isDarkMode()
  const contentRef = useRef()
  const {playSound} = useSoundPlayer()
  const {animate: animatePress, animation: pressingAnimation, isAnimating: isAnimatingPress} = useAnimationStation()

  const size = props.size || MenuButton.SIZE_DEFAULT
  const variant = props.variant || MenuButton.VARIANT_DEFAULT

  let bgColor
  let textColor
  if (props.isDisabled) {
    bgColor = isDark ? darkGrey : grey
    textColor = isDark ? grey : darkGrey
  } else {
    switch (variant) {
      case MenuButton.VARIANT_DESTRUCTIVE:
        bgColor = isDark ? dimmedRed : neonRed
        textColor = isDark ? white : black
        break

      case MenuButton.VARIANT_DEFAULT:
      default:
        bgColor = isDark ? black : white
        textColor = isDark ? dimmedRed : neonRed
        break
    }
  }

  const canPress = !props.isDisabled && !props.isLoading

  const doBlur = () => {
    animate(BLUR_DURATION + Math.random() * BLUR_DURATION, () => setTimer(blurKey, doBlur, parseInt(Math.random() * BLUR_DELAY)))
  }
  useEffect(() => {
    doBlur()

    return () => {
      cancel()
    }
  }, [])

  const handlePress = () => {
    if (isAnimatingPress) {
      return
    }

    if (typeof props.onPressStart === 'function') {
      let startResponse = props.onPressStart()
      if (!startResponse) {
        playSound(SOUND_BUTTON_BEEP).then()
        return
      }
    }

    if (typeof props.onPress === 'function') {
      playSound(SOUND_BUTTON_CHIME).then()
      animatePress(PRESS_DELAY, () => {
        props.onPress()
      })
    }
  }

  return (
    <View style={props.style}>
      {!props.isDisabled && !!contentRef.current && props.blurCount > 0 && (
        <View
          style={{position: 'absolute', top: 0, left: 0, zIndex: -1, width: contentRef.current.width, height: contentRef.current.height}}
        >
          {[...new Array(props.blurCount)].map((e, i) => {
            return (
              <ButtonShadow
                key={i}
                color={textColor}
                animationStyle={{
                  ...getOutOfFocusStylesForAnimation(animation, undefined, undefined, spaceSmall),
                  opacity: (i + 1) / (props.blurCount + 1),
                }}
              />
            )
          })}
        </View>
      )}
      {isAnimatingPress && (
        <Animated.View
          style={[
            styles.pressingOverlay,
            {
              backgroundColor: textColor,
              ...getFlashStylesForAnimation(pressingAnimation),
            },
          ]}
        />
      )}
      <Pressable
        onLayout={(event) => {
          contentRef.current = event.nativeEvent.layout
        }}
        style={[
          styles.primary,
          {
            backgroundColor: bgColor,
            borderColor: textColor,
            justifyContent: props.icon ? 'flex-start' : 'center',
            zIndex: 10,
          },
        ]}
        onPress={canPress ? handlePress : () => {}}
      >
        {props.isLoading ? (
          <Icon icon={Loading} color={textColor} transform={{rotate: 90}} />
        ) : (
          <React.Fragment>
            {props.icon && <Icon color={textColor} icon={props.icon} style={styles.icon} size={size} />}
            <UIText style={{color: getUIColor(isDark), fontSize: size}}>{props.title}</UIText>
          </React.Fragment>
        )}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  pressingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 4,
    opacity: 1,
    zIndex: 12,
  },
  primary: {
    padding: spaceSmall,
    paddingHorizontal: spaceDefault,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: neonRed,
    borderStyle: 'solid',
  },
  icon: {
    marginRight: spaceDefault,
  },
})

MenuButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  onPressStart: PropTypes.func, // must return true to continue processing the long press
  isDisabled: PropTypes.bool,
  variant: PropTypes.string,
  size: PropTypes.number,
  icon: PropTypes.any,
  style: PropTypes.any,
  isLoading: PropTypes.bool,
  blurCount: PropTypes.number,
}

MenuButton.SIZE_X_LARGE = font4
MenuButton.SIZE_LARGE = font3
MenuButton.SIZE_DEFAULT = font2
MenuButton.SIZE_SMALL = font1

MenuButton.VARIANT_DEFAULT = 'default'
MenuButton.VARIANT_DESTRUCTIVE = 'destructive'

export default MenuButton
