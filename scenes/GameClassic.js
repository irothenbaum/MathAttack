import React, {useState, useRef, useEffect, useCallback} from 'react'
import {
  Alert,
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native'
import EquationBox from '../components/EquationBox'
import {useDispatch, useSelector} from 'react-redux'
import {
  selectUserAnswer,
  selectCurrentQuestion,
  selectClassicGameSettings,
  selectClassicGameResults,
} from '../redux/selectors'
import {recordAnswer, generateNewQuestion} from '../redux/GameClassicSlice'
import {ANSWER_TIMEOUT} from '../constants/game'
import CalculatorInput from '../components/UI/CalculatorInput'
import QuestionResult from '../models/QuestionResult'
import GameQuestion from '../models/GameQuestion'
import {setAnswer} from '../redux/UISlice'
import {dimmedGreen, dimmedRed, neonGreen, neonRed} from '../styles/colors'
import answerReactionResults from '../hooks/answerReactionResults'
import {goToScene} from '../redux/NavigationSlice'
import {Scene_GameResults} from '../constants/scenes'
import {
  getBackgroundColor,
  getVibrateStylesForAnimation,
} from '../lib/utilities'
import animationStation from '../hooks/animationStation'
import isDarkMode from '../hooks/isDarkMode'

function GameClassic() {
  const dispatch = useDispatch()
  const isDark = isDarkMode()
  const {animation: equationTimer, animate: startEquationTimer} =
    animationStation()
  const {isAnimatingForCorrect, animation, animateCorrect, animateIncorrect} =
    answerReactionResults()
  const userAnswer = useSelector(selectUserAnswer)
  const currentQuestion = useSelector(selectCurrentQuestion)
  const gameSettings = useSelector(selectClassicGameSettings)
  const allAnswers = useSelector(selectClassicGameResults)

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

  const handleNextQuestion = () => {
    // always reset the input
    dispatch(setAnswer(''))
    if (questionsRemaining > 0) {
      dispatch(generateNewQuestion())
      setQuestionsRemaining(questionsRemaining - 1)
    } else {
      console.log(JSON.stringify(allAnswers))
      dispatch(
        goToScene(Scene_GameResults, {
          results: allAnswers,
        }),
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
      dispatch(setAnswer(''))
      animateIncorrect()
    }
  }

  const handleTimeout = () => {
    dispatch(recordAnswer(ANSWER_TIMEOUT))
    animateIncorrect()
    handleNextQuestion()
  }

  const getAnimationColor = () => {
    return isAnimatingForCorrect
      ? isDark
        ? dimmedGreen
        : neonGreen
      : isDark
      ? dimmedRed
      : neonRed
  }

  return (
    <View
      style={[
        styles.window,
        {backgroundColor: getBackgroundColor(isDarkMode())},
      ]}>
      {!!animation && (
        <Animated.View
          style={[
            styles.celebrationBG,
            {
              backgroundColor: getAnimationColor(),
              opacity: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            },
          ]}
        />
      )}
      <TouchableWithoutFeedback onPress={handleGuess}>
        <View style={styles.equationContainer}>
          {!!currentQuestion && (
            <EquationBox
              style={
                !!animation && !isAnimatingForCorrect
                  ? getVibrateStylesForAnimation(animation)
                  : null
              }
              equation={currentQuestion.equation}
              timerAnimation={equationTimer}
            />
          )}
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

  celebrationBG: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },

  equationContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  calculatorContainer: {
    flex: 2,
  },
})

export default GameClassic
