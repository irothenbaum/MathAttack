import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Animated, Easing, Pressable, StyleSheet, View} from 'react-native'
import {getScreenPositionFromLayoutEvent, getFlashStylesForAnimation, termStrToTerm} from '../lib/utilities'
import useColorsControl from '../hooks/useColorsControl'
import UIText from './UIText'
import {spaceSmall} from '../styles/layout'
import {RoundBox} from '../styles/elements'
import Icon, {ArrowLeft, ArrowRight} from './Icon'
import useAnimationStation from '../hooks/useAnimationStation'

// ---------------------------------------------------------------------

function Term(props) {
  const {operation, term} = termStrToTerm(props.termStr)
  const {green, foreground, background} = useColorsControl()

  const handleLayout = (e) => getScreenPositionFromLayoutEvent(e).then(props.onRendered)

  return (
    <Pressable onPress={() => props.onPress(props.termStr)}>
      <View
        style={[
          styles.singleTermContainer,
          {
            backgroundColor: props.isSelected ? props.selectedColor || green : 'transparent',
          },
        ]}
        onLayout={handleLayout}
      >
        {props.children}
        <UIText style={{zIndex: 2, color: props.isSelected ? background : foreground}}>
          {operation} {term}
        </UIText>
      </View>
    </Pressable>
  )
}

Term.propTypes = {
  termStr: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  selectedColor: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  onRendered: PropTypes.func,
  isDisabled: PropTypes.bool,
}

// ---------------------------------------------------------------------

function UITip(props) {
  const {blue} = useColorsControl()
  const interpolatedMargin = props.animation.interpolate({inputRange: [0, 1], outputRange: [-10, 20]})
  const interpolatedOpacity = props.animation.interpolate({inputRange: [0, 0.8, 1], outputRange: [1, 0, 0]})

  return (
    <View style={styles.tipContainer}>
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

UITip.propTypes = {
  animation: PropTypes.instanceOf(Animated.Value),
}

// ---------------------------------------------------------------------
const LOOP_DURATION = 1000
const TIP_PAUSE = 5000

function CrescendoRow(props) {
  const {red, green, background} = useColorsControl()
  const {animation, loop, cancel} = useAnimationStation()
  const [canShowTip, setCanShowTip] = useState(false)

  useEffect(() => {
    // don't show the tip arrows immediately
    const t = setTimeout(() => {
      // only show tip on rows with fewer than 3 terms
      setCanShowTip(true)
    }, TIP_PAUSE)

    return () => {
      clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    if (props.showTip && canShowTip) {
      loop(LOOP_DURATION, Easing.out(Easing.linear))
    } else {
      cancel()
    }
  }, [props.showTip, canShowTip])

  return (
    <View style={styles.termsRow}>
      {props.showTip && canShowTip ? <UITip animation={animation} /> : null}

      {props.termsArr.map((t, termIndex) => {
        const shouldFlash = props.isShowingResult && props.resultAnimation && props.correctTerms.includes(t)
        return (
          <Term
            termStr={t}
            key={`${termIndex}-${t}`}
            isSelected={shouldFlash || props.isTermSelected(t)}
            selectedColor={shouldFlash && !props.isResultCorrect ? red : green}
            onRendered={(screenPos) => props.onRenderedTerm(screenPos, t)}
            onPress={props.onPressTerm}
            isDisabled={props.isDisabled}
          >
            {shouldFlash && (
              <Animated.View
                style={[
                  styles.resultFlashOverlay,
                  {
                    backgroundColor: background,
                    ...getFlashStylesForAnimation(props.resultAnimation),
                  },
                ]}
              />
            )}
          </Term>
        )
      })}
    </View>
  )
}

CrescendoRow.propTypes = {
  termsArr: PropTypes.array.isRequired,
  correctTerms: PropTypes.array.isRequired,
  onRenderedTerm: PropTypes.func.isRequired,
  onPressTerm: PropTypes.func.isRequired,
  isTermSelected: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  showTip: PropTypes.bool,
}

const styles = StyleSheet.create({
  tipContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  singleTermContainer: {
    ...RoundBox,
    padding: spaceSmall,
  },

  termsRow: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    paddingVertical: spaceSmall,
  },

  resultFlashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: spaceSmall,
  },

  tipArrowContainer: {
    flexDirection: 'row',
    transform: [{scaleY: 2}],
  },
  tipArrow: {
    marginRight: -18,
  },
})

export default CrescendoRow
