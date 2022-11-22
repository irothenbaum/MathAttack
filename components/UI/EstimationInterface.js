import React, {useCallback, useEffect, useState} from 'react'
import {Animated, View, StyleSheet} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {selectCurrentQuestion, selectGameSettings, selectUserAnswer} from '../../redux/selectors'
import UIText from '../UIText'
import {font2} from '../../styles/typography'
import {spaceDefault} from '../../styles/layout'
import Equation from '../../models/Equation'
import {setAnswer} from '../../redux/UISlice'
import PropTypes from 'prop-types'
import useColorsControl from '../../hooks/useColorsControl'
import {VerticalDraggableCircle, SLIDER_SIZE} from './DraggableCircle'

const numberOfSteps = 10

// ----------------------------------------------------------------------------------------

function RulerNotch(props) {
  const {foreground} = useColorsControl()
  const showMinorNotches = props.value !== 0
  const colorStyle = {backgroundColor: foreground}
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

function EstimationInterface(props) {
  const {foreground, red} = useColorsControl()
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
        const {y, height} = ev.nativeEvent.layout
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
              backgroundColor: foreground,
              left: -timerBarWidth,
            },
          ]}
        >
          {props.equationTimer && (
            <Animated.View
              style={[
                styles.timerBar,
                {
                  backgroundColor: red,
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

const halfSlider = SLIDER_SIZE / 2
const rulerFontSize = font2
const timerBarWidth = 8
const markerWidth = 30

const styles = StyleSheet.create({
  correctAnswerMarker: {
    position: 'absolute',
    left: -(timerBarWidth / 2 + markerWidth / 2),
    width: markerWidth,
    height: 6,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderColor: 'transparent',
  },

  timerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: timerBarWidth,
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

/**
 * @typedef CorrectVerticalAnswerDetails
 * @property {number} guess
 * @property {number} guessTop
 * @property {number} answer
 * @property {number} answerTop
 * @property {number} answerDif
 * @property {number} markerTop
 * @property {number} markerHeight
 */

function Slider(props) {
  const {green, blue} = useColorsControl()
  const [containerHeight, setContainerHeight] = useState(undefined)
  const [tempValue, setTempValue] = useState(0)
  const settings = useSelector(selectGameSettings)
  const [startingPosition, setStartingPosition] = useState(undefined)
  const currentQuestion = useSelector(selectCurrentQuestion)
  /** @type {CorrectVerticalAnswerDetails} correctAnswerDetails */
  const [correctAnswerDetails, setCorrectVerticalAnswerDetails] = useState(undefined)

  const range = settings.maxValue - settings.minValue

  const dispatch = useDispatch()

  const getAnswerFromTopValue = useCallback(
    (topValue) => {
      const rawAnswer = ((containerHeight - (topValue + halfSlider)) / containerHeight) * range + settings.minValue
      return settings.decimalPlaces > 0 ? parseFloat(rawAnswer.toFixed(1)) : Math.round(rawAnswer)
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
    const guess = getAnswerFromTopValue(top)
    const guessPosition = top + halfSlider
    const correctAnswer = Equation.getSolution(currentQuestion.equation)
    const correctPosition = getTopFromAnswerValue(correctAnswer)
    setCorrectVerticalAnswerDetails({
      answer: correctAnswer,
      answerTop: correctPosition,
      guess: guess,
      guessTop: guessPosition,
      answerDif: Math.abs(correctAnswer - guess),
      markerTop: Math.min(guessPosition, correctPosition),
      markerHeight: Math.abs(guessPosition - correctPosition),
    })
    dispatch(setAnswer(guess))
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
      {props.showCorrectAnswer && correctAnswerDetails && correctAnswerDetails.answerDif > 0 && (
        <View
          style={[
            styles.correctAnswerMarker,
            {
              top: correctAnswerDetails.markerTop,
              height: correctAnswerDetails.markerHeight,
              backgroundColor: blue,
              ...(correctAnswerDetails.answer > correctAnswerDetails.guess ? {borderTopColor: green} : {borderBottomColor: green}),
            },
          ]}
        />
      )}
      {typeof startingPosition === 'number' && (
        <VerticalDraggableCircle
          showDecimals={settings.decimalPlaces > 0}
          value={tempValue}
          startingPosition={startingPosition}
          minVal={-halfSlider}
          maxVal={containerHeight - halfSlider}
          onDrag={handleSlide}
          onDragComplete={handleSubmitAnswer}
        />
      )}
    </View>
  )
}
