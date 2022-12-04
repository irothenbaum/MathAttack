import {Animated, Pressable, StyleSheet} from 'react-native'
import {font4} from '../styles/typography'
import React, {useEffect, useState} from 'react'
import {spaceExtraLarge, spaceLarge, spaceSmall} from '../styles/layout'
import {BoxShadow, FullScreenOverlay} from '../styles/elements'
import PropTypes from 'prop-types'
import useAnimationStation from '../hooks/useAnimationStation'
import Icon, {X} from './Icon'
import useColorsControl from '../hooks/useColorsControl'
import useBackAction from '../hooks/useBackAction'

const OPEN_TIME = 200
const CLOSE_TIME = OPEN_TIME

function BottomPanel(props) {
  const {shadowStrong, background} = useColorsControl()
  const {animate, animation, isAnimating} = useAnimationStation()
  const [isVisible, setIsVisible] = useState(false)

  const backAction = () => {
    if (props.isOpen) {
      props.onClose()
      return true
    }
  }
  useBackAction(backAction)

  useEffect(() => {
    if (props.isOpen) {
      setIsVisible(true)
      animate(OPEN_TIME)
    } else {
      animate(CLOSE_TIME, () => setIsVisible(false))
    }
  }, [props.isOpen])

  return (
    isVisible && (
      <Animated.View
        style={[
          styles.overlay,
          {backgroundColor: shadowStrong},
          isAnimating
            ? {
                opacity: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: props.isOpen ? [0, 1] : [1, 0],
                }),
              }
            : undefined,
        ]}
      >
        <Pressable onPress={props.onClose} style={styles.closeIcon}>
          <Icon icon={X} size={font4} color={background} />
        </Pressable>
        <Animated.View
          style={[
            styles.menuContainer,
            {backgroundColor: background},
            isAnimating
              ? {
                  marginBottom: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: props.isOpen ? [-200, 0] : [0, -200],
                  }),
                }
              : undefined,
          ]}
        >
          {props.children}
        </Animated.View>
      </Animated.View>
    )
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...FullScreenOverlay,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    zIndex: 20,
  },

  menuContainer: {
    width: '100%',
    marginTop: spaceExtraLarge,
    flex: 1,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    ...BoxShadow,
  },

  closeIcon: {
    position: 'absolute',
    top: spaceSmall,
    right: spaceSmall,
  },
})

BottomPanel.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
}

export default BottomPanel
