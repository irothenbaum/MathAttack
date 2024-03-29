import React, {useEffect} from 'react'
import {StyleSheet, View, Animated, Easing} from 'react-native'
import {font5} from '../../styles/typography'
import UIText from '../UIText'
import {spaceDefault} from '../../styles/layout'
import useAnimationStation from '../../hooks/useAnimationStation'
import Icon, {Star} from '../Icon'
import useColorsControl from '../../hooks/useColorsControl'

const SHOOTING_DURATION = 1000
const bigStarDifference = 20

function PerfectAnswerCelebration(props) {
  const {yellow, orange} = useColorsControl()
  const {animation, animate, isAnimating, cancel} = useAnimationStation()

  useEffect(() => {
    animate(SHOOTING_DURATION, undefined, Easing.inOut(Easing.back(1.8)))
    return () => {
      cancel()
    }
  }, [])

  return (
    <View style={[styles.container, props.style]}>
      <View style={[styles.starContainer]}>
        <Animated.View
          style={[
            isAnimating
              ? {
                  transform: [
                    {
                      rotateZ: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                }
              : undefined,
          ]}
        >
          <Icon icon={Star} style={styles.icon} size={font5} color={yellow} />
          <Icon icon={Star} size={font5 + bigStarDifference} color={orange} />
        </Animated.View>
      </View>
      <UIText style={styles.text}>Perfect!</UIText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  starContainer: {
    alignItems: 'center',
  },

  text: {
    textAlign: 'center',
    paddingTop: spaceDefault,
    fontWeight: 'bold',
  },

  icon: {
    position: 'absolute',
    zIndex: 2,
    top: bigStarDifference / 2,
    left: bigStarDifference / 2,
  },
})

export default PerfectAnswerCelebration
