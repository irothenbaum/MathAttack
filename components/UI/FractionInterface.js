import React, {useCallback, useEffect, useState} from 'react'
import {Animated, View, StyleSheet} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {selectCurrentQuestion, selectGameSettings, selectUserAnswer} from '../../redux/selectors'
import PropTypes from 'prop-types'
import useColorsControl from '../../hooks/useColorsControl'
import {HorizontalDraggableCircle, SLIDER_SIZE, TAIL_SIZE} from './DraggableCircle'
import Equation from '../../models/Equation'
import {setAnswer} from '../../redux/UISlice'
import NormalText from '../NormalText'
import FractionQuestionResult from '../../models/FractionQuestionResult'

const halfSlider = SLIDER_SIZE / 2

// ----------------------------------------------------------------------------------------

function FractionInterface(props) {
  const {foreground, green, red, blue} = useColorsControl()
  const answer = useSelector(selectUserAnswer)
  const settings = useSelector(selectGameSettings)

  useEffect(() => {
    if (settings.autoSubmit && answer) {
      props.onSubmitAnswer(answer)
    }
  }, [answer])

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.timerBar,
          {
            backgroundColor: foreground,
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

      <View style={[styles.box, {backgroundColor: blue}]}>
        <View style={[styles.boxLabel, {left: 0, backgroundColor: foreground}]}>
          <NormalText style={styles.boxLabelText}>0</NormalText>
        </View>
        <View style={[styles.boxLabel, {right: 0, backgroundColor: foreground}]}>
          <NormalText style={styles.boxLabelText}>1</NormalText>
        </View>
        <Slider
          onSlide={(v, t) => props.onChangeTempAnswer(v)}
          showCorrectAnswer={props.isAnimatingNextQuestion}
          isAnswerCorrect={props.isAnimatingForCorrect}
        />
      </View>
    </View>
  )
}

const timerBarHeight = 8
const markerWidth = 30
const barHeight = 50

const overflowMarkingAmount = 8

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  box: {
    height: barHeight,
    marginBottom: SLIDER_SIZE + TAIL_SIZE,
    width: '100%',
    overflow: 'visible',
  },

  boxLabel: {
    position: 'absolute',
    top: -overflowMarkingAmount,
    bottom: -overflowMarkingAmount,
    width: 2,
    overflow: 'visible',
    zIndex: 6, //
  },

  boxLabelText: {
    position: 'absolute',
    top: -30, // this is to get the text above the measure line
    left: -6, // this is to center the txt over the measure line
    width: 15, // this is to ensure enough space to print the text
  },

  timerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: timerBarHeight,
  },

  sliderContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: 5,
  },

  correctAnswerMarker: {
    position: 'absolute',
    top: -overflowMarkingAmount,
    left: -(timerBarHeight / 2 + markerWidth / 2),
    height: barHeight + 2 * overflowMarkingAmount,
    zIndex: 2,
  },

  selectedBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: barHeight,
    borderRightWidth: 2,
  },
})

FractionInterface.propTypes = {
  onSubmitAnswer: PropTypes.func.isRequired,
  onChangeTempAnswer: PropTypes.func.isRequired,
  equationTimer: PropTypes.any,
  isAnimatingNextQuestion: PropTypes.bool,
  nextQuestionAnimation: PropTypes.any,
  answerReactionAnimation: PropTypes.any,
  isAnimatingForCorrect: PropTypes.bool,
}

export default FractionInterface

/**
 * @typedef CorrectHorizontalAnswerDetails
 * @property {number} guess
 * @property {number} guessLeft
 * @property {number} answer
 * @property {number} answerLeft
 * @property {number} answerDif
 * @property {number} markerLeft
 * @property {number} markerWidth
 */

function Slider(props) {
  const {green, red, orange} = useColorsControl()
  const [containerWidth, setContainerWidth] = useState(undefined)
  const [tempValue, setTempValue] = useState(0)
  const settings = useSelector(selectGameSettings)
  const [startingPosition, setStartingPosition] = useState(undefined)
  const currentQuestion = useSelector(selectCurrentQuestion)
  /** @type {CorrectHorizontalAnswerDetails} correctAnswerDetails */
  const [correctAnswerDetails, setCorrectHorizontalAnswerDetails] = useState(undefined)

  const dispatch = useDispatch()

  const getAnswerFromLeftValue = useCallback(
    (leftValue) => {
      const rawAnswer = (leftValue + halfSlider) / containerWidth
      return parseFloat(rawAnswer.toFixed(2))
    },
    [containerWidth, settings],
  )

  const getLeftFromAnswerValue = useCallback((answerValue) => containerWidth * answerValue, [containerWidth, settings])

  // determine this initial starting position
  useEffect(() => {
    if (typeof containerWidth !== 'number') {
      return
    }
    setStartingPosition(getLeftFromAnswerValue(tempValue) - halfSlider)
  }, [getLeftFromAnswerValue])

  const handleSlide = (left) => {
    const temp = getAnswerFromLeftValue(left)
    setTempValue(temp)
    props.onSlide(temp, left)
  }

  const handleSubmitAnswer = (left) => {
    const guess = getAnswerFromLeftValue(left)
    const guessPosition = left + halfSlider
    const correctAnswer = Equation.getSolution(currentQuestion.equation)
    const correctPosition = getLeftFromAnswerValue(correctAnswer)

    const answerDetails = {
      answer: correctAnswer,
      answerLeft: correctPosition,
      guess: guess,
      guessLeft: guessPosition,
      answerDif: Math.abs(correctAnswer - guess),
      markerLeft: Math.min(guessPosition, correctPosition),
      markerWidth: Math.abs(guessPosition - correctPosition),
    }

    setCorrectHorizontalAnswerDetails(answerDetails)
    dispatch(setAnswer(guess))
  }

  const showCorrectAnswerMarker =
    props.showCorrectAnswer && correctAnswerDetails && correctAnswerDetails.answerDif > FractionQuestionResult.PERFECT_ANSWER_THRESHOLD

  return (
    <View
      style={[styles.sliderContainer, props.style]}
      onLayout={(ev) => {
        const {width} = ev.nativeEvent.layout
        if (width === 0) {
          return
        }
        setContainerWidth(width)
      }}
    >
      {showCorrectAnswerMarker && (
        <View
          style={[
            styles.correctAnswerMarker,
            {
              left: correctAnswerDetails.markerLeft,
              width: correctAnswerDetails.markerWidth,
              backgroundColor: props.isAnswerCorrect ? green : red,
            },
          ]}
        />
      )}
      {!showCorrectAnswerMarker && (
        <View style={[styles.selectedBox, {borderColor: green, backgroundColor: orange, width: getLeftFromAnswerValue(tempValue) || 0}]} />
      )}
      {typeof startingPosition === 'number' && (
        <HorizontalDraggableCircle
          showDecimals={false}
          value={tempValue * 100} // multiple by 100 so we can deal with percentages
          startingPosition={startingPosition}
          suffix={'.'}
          minVal={-halfSlider}
          maxVal={containerWidth - halfSlider}
          onDrag={handleSlide}
          onDragComplete={handleSubmitAnswer}
          style={{bottom: -(SLIDER_SIZE + TAIL_SIZE)}}
        />
      )}
    </View>
  )
}

Slider.propTypes = {
  isAnswerCorrect: PropTypes.bool,
  showCorrectAnswer: PropTypes.bool,
  onSlide: PropTypes.func,
}
