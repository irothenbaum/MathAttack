import React, {useState, useRef, useEffect, useCallback} from 'react'
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import EquationBox from '../components/EquationBox'
import {useDispatch, useSelector} from 'react-redux'
import {
  selectUserAnswer,
  selectCurrentQuestion,
  selectClassicGameSettings,
  selectUserInput,
} from '../redux/selectors'
import {recordAnswer, generateNewQuestion} from '../redux/GameClassicSlice'
import {ANSWER_TIMEOUT} from '../constants/game'
import CalculatorInput from '../components/UI/CalculatorInput'
import QuestionResult from '../models/QuestionResult'
import GameQuestion from '../models/GameQuestion'
import {setAnswer} from '../redux/UISlice'
import answerReactionResults from '../hooks/answerReactionResults'
import {goToScene} from '../redux/NavigationSlice'
import {Scene_GameResults} from '../constants/scenes'
import {getVibrateStylesForAnimation} from '../lib/utilities'
import animationStation from '../hooks/animationStation'
import GameBackground from '../components/FX/GameBackground'
import TitleText from '../components/TitleText'
import {RoundBox} from '../styles/elements'
import {spaceLarge} from '../styles/layout'
import GameStartTimer from '../components/GameStartTimer'
import doOnceTimer from '../hooks/doOnceTimer'
import Equation from '../models/Equation'
import isDarkMode from '../hooks/isDarkMode'
import {dimmedGreen, dimmedRed, neonGreen, neonRed} from '../styles/colors'

const NEXT_QUESTION_TIMEOUT = 2000
const NEXT_QUESTION_TIMER = 'next-question-timer'

function GameClassic() {
  const dispatch = useDispatch()
  const {animation: equationTimer, animate: startEquationTimer} =
    animationStation()
  const {isAnimatingForCorrect, animation, animateCorrect, animateIncorrect} =
    answerReactionResults()
  const userAnswer = useSelector(selectUserAnswer)
  const currentQuestion = useSelector(selectCurrentQuestion)
  const gameSettings = useSelector(selectClassicGameSettings)
  const userInput = useSelector(selectUserInput)
  const {setTimer, isTimerSet} = doOnceTimer()
  const isDark = isDarkMode()

  const lastGuess = useRef(null)
  const [questionsRemaining, setQuestionsRemaining] = useState(
    gameSettings.classicNumberOfRounds,
  )

  useEffect(() => {
    if (currentQuestion) {
      let msRemaining = GameQuestion.getMSRemaining(currentQuestion)
      let amountRemaining = 1 - msRemaining / gameSettings.equationDuration
      startEquationTimer(msRemaining, handleTimeout, amountRemaining)
    } else {
    }
  }, [currentQuestion])

  const handleNextQuestion = skipTimer => {
    // always reset the input
    lastGuess.current = null
    dispatch(setAnswer(''))
    if (questionsRemaining > 0) {
      setQuestionsRemaining(questionsRemaining - 1)

      if (skipTimer) {
        dispatch(generateNewQuestion())
      } else {
        setTimer(
          NEXT_QUESTION_TIMER,
          () => dispatch(generateNewQuestion()),
          NEXT_QUESTION_TIMEOUT,
        )
      }
    } else {
      setTimer(
        NEXT_QUESTION_TIMER,
        () => dispatch(goToScene(Scene_GameResults)),
        NEXT_QUESTION_TIMEOUT,
      )
    }
  }

  const handleGuess = () => {
    let result = new QuestionResult(currentQuestion, userAnswer)
    if (QuestionResult.isCorrect(result)) {
      dispatch(recordAnswer(userAnswer))
      animateCorrect()
      handleNextQuestion()
    } else {
      lastGuess.current = userAnswer
      dispatch(setAnswer(''))
      animateIncorrect()
    }
  }

  const handleTimeout = () => {
    dispatch(
      recordAnswer(
        typeof lastGuess.current === 'number'
          ? lastGuess.current
          : ANSWER_TIMEOUT,
      ),
    )
    animateIncorrect()
    handleNextQuestion()
  }

  const isShowingAnswer = !!currentQuestion && isTimerSet(NEXT_QUESTION_TIMER)

  return (
    <View style={styles.window}>
      {!currentQuestion && (
        <GameStartTimer onStart={() => handleNextQuestion(true)} />
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
              timerAnimation={isShowingAnswer ? null : equationTimer}
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

export default GameClassic
