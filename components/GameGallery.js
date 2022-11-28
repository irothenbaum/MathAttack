import React, {useEffect, useState} from 'react'
import {Easing, Animated, Pressable, StyleSheet, View} from 'react-native'
import PropTypes from 'prop-types'
import useAnimationStation from '../hooks/useAnimationStation'
import {spaceDefault, spaceSmall} from '../styles/layout'
import useColorsControl from '../hooks/useColorsControl'
import NormalText from './NormalText'

export function GameGalleryItem() {
  return null
}

const TRANSITION_DURATION = 200

function GameGallery(props) {
  const {red, background, foreground, shadowLight} = useColorsControl()
  const [currentTab, setCurrentTab] = useState(props.selected)
  const [nextTab, setNextTab] = useState(undefined)
  const {animation, animate, isAnimating} = useAnimationStation()

  // handle changing tabs animation
  useEffect(() => {
    if (props.selected === currentTab) {
      return
    }

    setNextTab(props.selected)

    animate(
      TRANSITION_DURATION,
      () => {
        setNextTab(undefined)
        setCurrentTab(props.selected)
      },
      Easing.out(Easing.linear),
    )
  }, [props.selected])

  const selectedItem = props.children[currentTab]
  const nextItem = props.children[nextTab]

  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.gallerySelectorContainer}>
        {props.titles.map((t, i) => {
          const isSelectedTab = i === props.selected
          return (
            <Pressable
              key={t}
              onPress={() => props.onSelect(i)}
              style={[
                styles.gallerySelector,
                {
                  backgroundColor: isSelectedTab ? red : shadowLight,
                },
              ]}
            >
              <NormalText
                style={{
                  textAlign: 'center',
                  color: isSelectedTab ? background : foreground,
                  fontWeight: isSelectedTab ? 'bold' : 'normal',
                }}
              >
                {t}
              </NormalText>
            </Pressable>
          )
        })}
      </View>
      <View style={styles.galleryContainer}>
        {selectedItem && (
          <Animated.View
            style={[styles.galleryItem, isAnimating ? {opacity: animation.interpolate({inputRange: [0, 1], outputRange: [1, 0]})} : null]}
          >
            {selectedItem.props.children}
          </Animated.View>
        )}
        {nextItem && (
          <Animated.View
            style={[
              styles.nextGalleryItem,
              isAnimating ? {left: animation.interpolate({inputRange: [0, 1], outputRange: ['100%', '0%']})} : null,
            ]}
          >
            {nextItem.props.children}
          </Animated.View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  gallerySelectorContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: spaceDefault,
  },

  galleryContainer: {
    width: '100%',
  },

  galleryItem: {
    width: '100%',
  },

  nextGalleryItem: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },

  gallerySelector: {
    flex: 1,
    paddingVertical: spaceSmall,
  },
})

GameGallery.propTypes = {
  style: PropTypes.any,
  selected: PropTypes.number,
  onSelect: PropTypes.func,
  titles: PropTypes.array,
}

export default GameGallery
