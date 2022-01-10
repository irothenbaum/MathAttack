import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  selectUserAnswer,
  selectCurrentQuestion,
  selectUserInput,
} from '../redux/selectors'
import {recordAnswer, generateNewQuestion} from '../redux/GameClassicSlice'
import QuestionResult from '../models/QuestionResult'
import {setAnswer} from '../redux/UISlice'
import answerReactionResults from '../hooks/answerReactionResults'
import {goToScene} from '../redux/NavigationSlice'
import {Scene_GameResults} from '../constants/scenes'
import doOnceTimer from '../hooks/doOnceTimer'
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native'
import GameStartTimer from '../components/GameStartTimer'
import GameBackground from '../components/FX/GameBackground'
import EquationBox from '../components/EquationBox'
import {getVibrateStylesForAnimation} from '../lib/utilities'
import TitleText from '../components/TitleText'
import {dimmedGreen, dimmedRed, neonGreen, neonRed} from '../styles/colors'
import Equation from '../models/Equation'
import CalculatorInput from '../components/UI/CalculatorInput'
import {RoundBox} from '../styles/elements'
import {spaceLarge} from '../styles/layout'
import isDarkMode from '../hooks/isDarkMode'

const NEXT_QUESTION_TIMEOUT = 2000
const NEXT_QUESTION_TIMER = 'next-question-timer'

function GameMarathon() {
  const isDark = isDarkMode()
  const dispatch = useDispatch()
  const {isAnimatingForCorrect, animation, animateCorrect, animateIncorrect} =
    answerReactionResults()

  const [strikes, setStrikes] = useState(3)
  const userInput = useSelector(selectUserInput)
  const userAnswer = useSelector(selectUserAnswer)
  const currentQuestion = useSelector(selectCurrentQuestion)
  const {setTimer, isTimerSet} = doOnceTimer()

  const handleGuess = () => {
    dispatch(recordAnswer(userAnswer))

    let result = new QuestionResult(currentQuestion, userAnswer)
    if (QuestionResult.isCorrect(result)) {
      animateCorrect()
      dispatch(setAnswer(''))
      setTimer(
        NEXT_QUESTION_TIMER,
        () => dispatch(generateNewQuestion()),
        NEXT_QUESTION_TIMEOUT,
      )
    } else {
      let hasStrikesRemaining = strikes > 0
      if (hasStrikesRemaining) {
        setStrikes(strikes - 1)
      }

      console.log(strikes, hasStrikesRemaining)

      dispatch(setAnswer(''))
      animateIncorrect()
      setTimer(
        NEXT_QUESTION_TIMER,
        () => {
          if (hasStrikesRemaining) {
            dispatch(generateNewQuestion())
          } else {
            dispatch(goToScene(Scene_GameResults))
          }
        },
        NEXT_QUESTION_TIMEOUT,
      )
    }
  }

  const isShowingAnswer = !!currentQuestion && isTimerSet(NEXT_QUESTION_TIMER)

  return (
    <View style={styles.window}>
      {!currentQuestion && (
        <GameStartTimer onStart={() => dispatch(generateNewQuestion())} />
      )}
      <GameBackground
        animation={animation}
        isAnimatingForCorrect={isAnimatingForCorrect}
      />
      <TouchableWithoutFeedback
        onPress={isShowingAnswer ? () => {} : handleGuess}>
        <View style={styles.equationContainer}>
          {!!currentQuestion && (
            <EquationBox
              style={
                !!animation && !isAnimatingForCorrect
                  ? getVibrateStylesForAnimation(animation)
                  : null
              }
              equation={currentQuestion.equation}
            />
          )}

          <View style={styles.answerBar}>
            <TitleText
              style={[
                styles.answerText,
                isShowingAnswer && {
                  color: isAnimatingForCorrect
                    ? isDark
                      ? dimmedGreen
                      : neonGreen
                    : isDark
                    ? dimmedRed
                    : neonRed,
                },
              ]}>
              {isShowingAnswer
                ? Equation.getSolution(currentQuestion.equation)
                : userInput || 0}
            </TitleText>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.calculatorContainer}>
        <CalculatorInput />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  window: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },

  answerBar: {
    ...RoundBox,
    paddingRight: spaceLarge,
  },

  answerText: {
    width: '100%',
    textAlign: 'right',
  },

  equationContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  calculatorContainer: {
    flex: 1,
  },
})

export default GameMarathon
