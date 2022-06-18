import React, {useEffect} from 'react'
import {StyleSheet, View, Animated, Easing} from 'react-native'
import {faStar} from '@fortawesome/free-solid-svg-icons'
import {font5} from '../../styles/typography'
import {neonYellow, dimmedYellow, dimmedOrange, neonOrange} from '../../styles/colors'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import UIText from '../UIText'
import isDarkMode from '../../hooks/isDarkMode'
import {spaceDefault} from '../../styles/layout'
import useAnimationStation from '../../hooks/useAnimationStation'

const SHOOTING_DURATION = 1000
const bigStarDifference = 20

function PerfectAnswerCelebration(props) {
  const isDark = isDarkMode()
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
          <FontAwesomeIcon style={styles.icon} icon={faStar} size={font5} color={isDark ? dimmedYellow : neonYellow} />
          <FontAwesomeIcon icon={faStar} size={font5 + bigStarDifference} color={isDark ? dimmedOrange : neonOrange} />
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
