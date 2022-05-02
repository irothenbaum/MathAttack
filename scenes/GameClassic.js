import React, {useState, useRef, useEffect} from 'react'
import {View, StyleSheet, Easing} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {
  selectUserAnswer,
  selectCurrentQuestion,
  selectGameSettings,
} from '../redux/selectors'
import {recordAnswer, generateNewQuestion} from '../redux/GameSlice'
import {ANSWER_TIMEOUT} from '../constants/game'
import CalculatorInput from '../components/UI/CalculatorInput'
import QuestionResult from '../models/QuestionResult'
import GameQuestion from '../models/GameQuestion'
import {setAnswer} from '../redux/UISlice'
import useAnswerReactionResults from '../hooks/useAnswerReactionResults'
import {goToScene} from '../redux/NavigationSlice'
import {Scene_GameResults} from '../constants/scenes'
import useAnimationStation from '../hooks/useAnimationStation'
import GameBackground from '../components/FX/GameBackground'
import {ScreenContainer} from '../styles/elements'
import GameStartTimer from '../components/GameStartTimer'
import useDoOnceTimer from '../hooks/useDoOnceTimer'
import InGameMenu from '../components/InGameMenu'
import EquationAndAnswerInterface from '../components/UI/EquationAndAnswerInterface'

const NEXT_QUESTION_TIMEOUT = 2000
const NEXT_QUESTION_TIMER = 'next-question-timer'

function GameClassic() {
  const dispatch = useDispatch()
  const {
    animation: equationTimer,
    animate: startEquationTimer,
    cancel: cancelEquationTimer,
  } = useAnimationStation()
  const {isAnimatingForCorrect, animation, animateCorrect, animateIncorrect} =
    useAnswerReactionResults()
  const userAnswer = useSelector(selectUserAnswer)
  const currentQuestion = useSelector(selectCurrentQuestion)
  const gameSettings = useSelector(selectGameSettings)
  const {setTimer, isTimerSet} = useDoOnceTimer()

  const lastGuess = useRef(null)
  const [questionsRemaining, setQuestionsRemaining] = useState(
    gameSettings.classicNumberOfRounds,
  )

  useEffect(() => {
    if (currentQuestion) {
      let msRemaining = GameQuestion.getMSRemaining(currentQuestion)
      let amountRemaining = 1 - msRemaining / gameSettings.equationDuration
      startEquationTimer(
        msRemaining,
        handleTimeout,
        Easing.linear,
        amountRemaining,
      )
    } else {
      cancelEquationTimer()
    }
  }, [currentQuestion])

  const handleNextQuestion = () => {
    // always reset the input
    lastGuess.current = null
    dispatch(setAnswer(''))
    let nextQuestionsRemaining = questionsRemaining - 1
    if (nextQuestionsRemaining > 0) {
      setQuestionsRemaining(nextQuestionsRemaining)
      setTimer(
        NEXT_QUESTION_TIMER,
        () => dispatch(generateNewQuestion()),
        NEXT_QUESTION_TIMEOUT,
      )
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

  const handleGameStart = () => {
    dispatch(generateNewQuestion())
    animateCorrect()
  }

  const isShowingAnswer = !!currentQuestion && isTimerSet(NEXT_QUESTION_TIMER)

  return (
    <View style={styles.window}>
      <InGameMenu />
      {!currentQuestion && <GameStartTimer onStart={handleGameStart} />}
      <GameBackground
        animation={animation}
        isAnimatingForCorrect={isAnimatingForCorrect}
      />

      <EquationAndAnswerInterface
        onGuess={handleGuess}
        equationTimer={equationTimer}
        isAnimatingNextQuestion={isShowingAnswer}
        isAnimatingForCorrect={isAnimatingForCorrect}
        answerReactionAnimation={animation}
      />

      <View style={styles.calculatorContainer}>
        <CalculatorInput isDisabled={isShowingAnswer} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  window: {...ScreenContainer},

  equationContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  calculatorContainer: {
    flex: 1,
  },
})

export default GameClassic
