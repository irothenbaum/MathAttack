import {Animated, Pressable, StyleSheet} from 'react-native'
import {font2} from '../styles/typography'
import React, {useEffect, useState} from 'react'
import {spaceDefault, spaceSmall} from '../styles/layout'
import {BoxShadow, FullScreenOverlay} from '../styles/elements'
import PropTypes from 'prop-types'
import useAnimationStation from '../hooks/useAnimationStation'
import Icon, {X} from './Icon'
import useColorsControl from '../hooks/useColorsControl'

const OPEN_TIME = 200
const CLOSE_TIME = OPEN_TIME

function Modal(props) {
  const {shadow, background} = useColorsControl()
  const {animate, animation, isAnimating} = useAnimationStation()
  const [isVisible, setIsVisible] = useState(false)

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
          {backgroundColor: shadow},
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
        <Pressable onPress={props.onClose} style={styles.modalClickHandler}>
          <Animated.View
            style={[
              styles.menuContainer,
              {backgroundColor: background},
              isAnimating
                ? {
                    marginTop: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: props.isOpen ? [200, 0] : [0, 200],
                    }),
                  }
                : undefined,
            ]}
          >
            <Pressable onPress={(e) => e.stopPropagation()} style={{padding: spaceDefault}}>
              <Pressable style={styles.closeIcon} onPress={props.onClose}>
                <Icon icon={X} color={shadow} size={font2} />
              </Pressable>
              {props.children}
            </Pressable>
          </Animated.View>
        </Pressable>
      </Animated.View>
    )
  )
}

const styles = StyleSheet.create({
  closeIcon: {
    position: 'absolute',
    top: spaceSmall,
    right: spaceSmall,
    zIndex: 20,
  },

  overlay: {
    ...FullScreenOverlay,
    zIndex: 20,
  },

  menuContainer: {
    width: '80%',
    borderRadius: 4,
    ...BoxShadow,
  },

  modalClickHandler: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default Modal
