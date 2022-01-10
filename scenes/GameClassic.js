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
import {spaceExtraLarge, spaceLarge} from '../styles/layout'

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
      dispatch(goToScene(Scene_GameResults))
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

  return (
    <View style={styles.window}>
      <GameBackground
        animation={animation}
        isAnimatingForCorrect={isAnimatingForCorrect}
      />
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

          <View style={styles.answerBar}>
            <TitleText style={styles.answerText}>{userInput || 0}</TitleText>
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
