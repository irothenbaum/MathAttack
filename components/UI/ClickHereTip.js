import React, {useEffect, useState} from 'react'
import useColorsControl from '../../hooks/useColorsControl'
import {Animated, Easing, StyleSheet, View} from 'react-native'
import Icon, {ArrowLeft, ArrowRight} from '../Icon'
import PropTypes from 'prop-types'
import useAnimationStation from '../../hooks/useAnimationStation'

const DEFAULT_PAUSE = 5000
const LOOP_DURATION = 1000

function ClickHereTip(props) {
  const {blue} = useColorsControl()
  const {animation, loop, cancel, isAnimating} = useAnimationStation()

  const [canShowTip, setCanShowTip] = useState(false)

  useEffect(() => {
    if (props.show) {
      loop(LOOP_DURATION, Easing.out(Easing.linear))
    } else {
      cancel()
    }
  }, [props.show])

  useEffect(() => {
    // don't show the tip arrows immediately
    const t = setTimeout(
      () => {
        setCanShowTip(true)
      },
      typeof props.pauseDuration === 'number' ? props.pauseDuration : DEFAULT_PAUSE,
    )

    return () => {
      clearTimeout(t)
    }
  }, [])

  if (!isAnimating || !canShowTip) {
    return null
  }

  const interpolatedMargin = animation.interpolate({inputRange: [0, 1], outputRange: [-10, 20]})
  const interpolatedOpacity = animation.interpolate({inputRange: [0, 0.8, 1], outputRange: [1, 0, 0]})

  return (
    <View style={[styles.tipContainer, props.style]}>
      <Animated.View
        style={[
          styles.tipArrowContainer,
          {
            marginLeft: interpolatedMargin,
            opacity: interpolatedOpacity,
          },
        ]}
      >
        <Icon style={[styles.tipArrow, {opacity: 0.8}]} icon={ArrowRight} color={blue} />
        <Icon icon={ArrowRight} color={blue} />
      </Animated.View>
      <Animated.View
        style={[
          styles.tipArrowContainer,
          {
            marginRight: interpolatedMargin,
            opacity: interpolatedOpacity,
          },
        ]}
      >
        <Icon style={styles.tipArrow} icon={ArrowLeft} color={blue} />
        <Icon style={{opacity: 0.8}} icon={ArrowLeft} color={blue} />
      </Animated.View>
    </View>
  )
}

ClickHereTip.propTypes = {
  show: PropTypes.bool,
  pauseDuration: PropTypes.number,
  style: PropTypes.any,
}

const styles = StyleSheet.create({
  tipContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  tipArrowContainer: {
    flexDirection: 'row',
    transform: [{scaleY: 2}],
  },
  tipArrow: {
    marginRight: -18,
  },
})

export default ClickHereTip
