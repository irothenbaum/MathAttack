import React, {useCallback, useEffect, useState} from 'react'
import {Animated, PanResponder, View, StyleSheet} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {selectCurrentQuestion, selectGameSettings, selectUserAnswer} from '../../redux/selectors'
import UIText from '../UIText'
import {font2, font3, font1} from '../../styles/typography'
import {spaceDefault, spaceSmall} from '../../styles/layout'
import isDarkMode from '../../hooks/isDarkMode'
import {getUIColor} from '../../lib/utilities'
import Equation from '../../models/Equation'
import {setAnswer} from '../../redux/UISlice'
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import PropTypes from 'prop-types'
import {dimmedRed, neonGreen, neonRed} from '../../styles/colors'

const numberOfSteps = 10

// ----------------------------------------------------------------------------------------

function RulerNotch(props) {
  const isDark = isDarkMode()
  const showMinorNotches = props.value !== 0
  const colorStyle = {backgroundColor: getUIColor(isDark)}
  const minorNotchColorStyle = {backgroundColor: showMinorNotches ? colorStyle.backgroundColor : 'transparent'}

  return (
    <View style={styles.notchContainer} onLayout={props.onLayout}>
      <View style={styles.notchMarksContainer}>
        <View style={[styles.rulerMarkPrimary, colorStyle]} />
        <View style={[styles.rulerMarkMinor, minorNotchColorStyle]} />
        <View style={[styles.rulerMarkMinor, minorNotchColorStyle]} />
      </View>
      <UIText style={styles.rulerText}>{props.value}</UIText>
    </View>
  )
}

// ----------------------------------------------------------------------------------------
/*
Slider not working, some crash bullshit using Draggable Circle for now

import {useSharedValue, useAnimatedStyle, withSpring} from 'react-native-reanimated'
import {GestureDetector, Gesture} from 'react-native-gesture-handler'

function Slider(props) {
  const isPressed = useSharedValue(false)
  const offset = useSharedValue({x: 0, y: 0})
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateX: offset.value.x}, {translateY: offset.value.y}, {scale: withSpring(isPressed.value ? 1.2 : 1)}],
      backgroundColor: isPressed.value ? 'yellow' : 'blue',
    }
  })

  const start = useSharedValue({x: 0, y: 0})
  const gesture = Gesture.Pan()
    .averageTouches(true)
    .onUpdate((e) => {
      console.log('UPDATE')
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      }
    })
    .onEnd(() => {
      console.log('END')
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      }
    })

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.slider, {borderColor: getUIColor(isDarkMode())}, animatedStyles, props.style]} />
    </GestureDetector>
  )
}*/

// ----------------------------------------------------------------------------------------

function EstimationInterface(props) {
  const isDark = isDarkMode()
  const [containerBottomPosition, setContainerBottomPosition] = useState(0)
  const [topNotchTopPosition, setTopNotchTopPosition] = useState(1)
  const [bottomNotchTopPosition, setBottomNotchTopPosition] = useState(1)
  const answer = useSelector(selectUserAnswer)
  const settings = useSelector(selectGameSettings)

  useEffect(() => {
    if (settings.autoSubmit && answer) {
      props.onSubmitAnswer(answer)
    }
  }, [answer])

  const fontSizeAdjust = rulerFontSize / 2
  const range = settings.maxValue - settings.minValue
  const stepSize = range / numberOfSteps

  return (
    <View
      style={styles.container}
      onLayout={(ev) => {
        const {x, y, height, width} = ev.nativeEvent.layout
        setContainerBottomPosition(y + height)
      }}
    >
      <Slider
        onSlide={(v, t) => props.onChangeTempAnswer(v)}
        style={{
          top: topNotchTopPosition + fontSizeAdjust,
          bottom: containerBottomPosition - fontSizeAdjust - bottomNotchTopPosition,
        }}
        showCorrectAnswer={props.isAnimatingNextQuestion}
      />
      <View style={styles.ruler}>
        <View
          style={[
            styles.timerBar,
            {
              backgroundColor: getUIColor(isDark),
              left: -8,
            },
          ]}
        >
          {props.equationTimer && (
            <Animated.View
              style={[
                styles.timerBar,
                {
                  backgroundColor: isDark ? dimmedRed : neonRed,
                  height: props.equationTimer.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          )}
        </View>
        {containerBottomPosition > 0 &&
          [...new Array(numberOfSteps + 1)].map((e, i) => {
            const value = parseInt(stepSize * (numberOfSteps - i))
            return (
              <RulerNotch
                key={value}
                value={value}
                onLayout={
                  i === 0 || i === numberOfSteps
                    ? (ev) => {
                        const {x, y, height, width} = ev.nativeEvent.layout
                        if (i === 0) {
                          setTopNotchTopPosition(y)
                        } else if (i === numberOfSteps) {
                          setBottomNotchTopPosition(y)
                        }
                      }
                    : undefined
                }
              />
            )
          })}
      </View>
    </View>
  )
}

const sliderSize = 70
const halfSlider = sliderSize / 2
const rulerFontSize = font2
const correctAnswerMarkerHeight = 6

const styles = StyleSheet.create({
  correctAnswerMarker: {
    position: 'absolute',
    left: -20,
    width: 40,
    height: correctAnswerMarkerHeight,
    backgroundColor: neonGreen,
  },

  timerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: 8,
  },

  container: {
    marginRight: spaceDefault,
  },

  ruler: {
    paddingVertical: halfSlider,
    height: '100%',
    width: 100,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  notchContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingRight: spaceDefault,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flex: 1,
    overflow: 'visible',
  },

  notchMarksContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '100%',
  },

  rulerMarkMinor: {
    width: 10,
    height: 2,
  },

  rulerMarkPrimary: {
    width: 18,
    height: 4,
  },

  rulerText: {
    flex: 1,
    textAlign: 'right',
    fontSize: rulerFontSize,
  },

  slider: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.5)',
    bottom: 0,
    right: 0,
    zIndex: 10,
    opacity: 0, // we're using this to hide the slider until startingPosition is established
    borderWidth: 4,
    borderRadius: halfSlider,
    height: sliderSize,
    width: sliderSize,
  },

  sliderActive: {
    backgroundColor: 'rgba(255,255,255, 0.3)',
  },

  sliderInActive: {
    backgroundColor: 'rgba(255,255,255, 1)',
  },

  sliderContainer: {
    position: 'absolute',
    top: halfSlider,
    left: 0,
    bottom: halfSlider,
    right: 0,
    zIndex: 10,
  },
})

EstimationInterface.propTypes = {
  onSubmitAnswer: PropTypes.func.isRequired,
  onChangeTempAnswer: PropTypes.func.isRequired,
  equationTimer: PropTypes.any,
  isAnimatingNextQuestion: PropTypes.bool,
  nextQuestionAnimation: PropTypes.any,
  answerReactionAnimation: PropTypes.any,
  isAnimatingForCorrect: PropTypes.bool,
}

export default EstimationInterface

function Slider(props) {
  const [containerHeight, setContainerHeight] = useState(undefined)
  const [tempValue, setTempValue] = useState(0)
  const settings = useSelector(selectGameSettings)
  const [startingPosition, setStartingPosition] = useState(undefined)
  const currentQuestion = useSelector(selectCurrentQuestion)

  const range = settings.maxValue - settings.minValue

  const dispatch = useDispatch()

  const getAnswerFromTopValue = useCallback(
    (topValue) => {
      const rawAnswer = ((containerHeight - (topValue + halfSlider)) / containerHeight) * range + settings.minValue
      return settings.decimalPlaces > 0 ? rawAnswer.toFixed(1) : Math.round(rawAnswer)
    },
    [containerHeight, range, settings],
  )

  const getTopFromAnswerValue = useCallback(
    (answerValue) => -1 * ((containerHeight * (answerValue - settings.minValue)) / range - containerHeight),
    [containerHeight, range, settings],
  )

  // determine this initial starting position
  useEffect(() => {
    if (typeof containerHeight !== 'number') {
      return
    }
    setStartingPosition(getTopFromAnswerValue(tempValue) - halfSlider)
  }, [getTopFromAnswerValue])

  const handleSlide = (top) => {
    const temp = getAnswerFromTopValue(top)
    setTempValue(temp)
    props.onSlide(temp, top)
  }

  const handleSubmitAnswer = (top) => {
    dispatch(setAnswer(getAnswerFromTopValue(top)))
  }

  return (
    <View
      style={[styles.sliderContainer, props.style]}
      onLayout={(ev) => {
        const {height} = ev.nativeEvent.layout
        if (height === 0) {
          return
        }
        setContainerHeight(height)
      }}
    >
      {props.showCorrectAnswer && (
        <View
          style={[
            styles.correctAnswerMarker,
            {top: getTopFromAnswerValue(Equation.getSolution(currentQuestion.equation)) - correctAnswerMarkerHeight / 2},
          ]}
        />
      )}
      {typeof startingPosition === 'number' && (
        <DraggableCircle
          showDecimals={settings.decimalPlaces > 0}
          value={tempValue}
          startingPosition={startingPosition}
          minTop={-halfSlider}
          maxTop={containerHeight - halfSlider}
          onDrag={handleSlide}
          onDragComplete={handleSubmitAnswer}
        />
      )}
    </View>
  )
}

/**
 * @see https://necolas.github.io/react-native-web/docs/pan-responder/
 */
class DraggableCircle extends React.Component {
  constructor(props) {
    super(props)
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: this._handlePanResponderGrant.bind(this),
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    })
    this._isPressed = false
    this._previousTop = 0
    this._circleTopStyle = this._previousTop
  }

  _normalizeTopValue(top) {
    return Math.min(Math.max(this._previousTop + top, this.props.minTop), this.props.maxTop)
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (typeof nextProps.startingPosition === 'number' && nextProps.startingPosition !== this._startingTop && !this._isPressed) {
      this._startingTop = nextProps.startingPosition
      this._previousTop = this._circleTopStyle = this._normalizeTopValue(nextProps.startingPosition)
      this._updateNativeStyles()
    }
    return nextProps.value !== this.props.value
  }

  componentDidMount() {
    this._updateNativeStyles()
  }

  render() {
    const isDark = isDarkMode()
    const mainValue = this.props.showDecimals ? parseInt(this.props.value) : Math.round(this.props.value)
    const decimal = (this.props.value - mainValue).toFixed(3).substr(1)

    return (
      <View ref={(c) => (this.circle = c)} style={styles.slider} {...this._panResponder.panHandlers}>
        <FontAwesomeIcon style={{position: 'absolute', left: -22}} icon={faChevronLeft} color={getUIColor(isDark)} size={font3} />
        <UIText style={{alignSelf: 'center', lineHeight: font3}}>{mainValue}</UIText>
        {this.props.showDecimals && <UIText style={{alignSelf: 'center', fontSize: font1, lineHeight: font1}}>{decimal}</UIText>}
      </View>
    )
  }

  _updateNativeStyles() {
    this.circle &&
      this.circle.setNativeProps({
        style: {
          opacity: typeof this._startingTop === 'number' ? 1 : 0,
          top: this._circleTopStyle,
          ...(this._isPressed ? styles.sliderActive : styles.sliderInActive),
        },
      })
  }

  _handlePanResponderGrant() {
    this._isPressed = true
    this._updateNativeStyles()
  }

  _handlePanResponderMove = (e: Object, gestureState: Object) => {
    this._circleTopStyle = this._normalizeTopValue(gestureState.dy)
    this.props.onDrag(this._circleTopStyle)
    this._updateNativeStyles()
  }

  _handlePanResponderEnd = (e: Object, gestureState: Object) => {
    this._previousTop = this._circleTopStyle
    this.props.onDragComplete(this._previousTop)
    this._isPressed = false
    this._updateNativeStyles()
  }
}
