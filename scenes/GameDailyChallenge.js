import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {selectUserAnswer, selectCurrentQuestion} from '../redux/selectors'
import {recordAnswer, generateNewQuestion} from '../redux/GameSlice'
import QuestionResult from '../models/QuestionResult'
import {setAnswer} from '../redux/UISlice'
import useAnswerReactionResults from '../hooks/useAnswerReactionResults'
import {goToScene} from '../redux/NavigationSlice'
import {Scene_GameResults} from '../constants/scenes'
import {StyleSheet, View, Easing} from 'react-native'
import GameStartTimer from '../components/GameStartTimer'
import GameBackground from '../components/FX/GameBackground'
import Equation from '../models/Equation'
import CalculatorInput from '../components/UI/CalculatorInput'
import {ScreenContainer} from '../styles/elements'
import {spaceSmall} from '../styles/layout'
import useAnimationStation from '../hooks/useAnimationStation'
import InGameMenu from '../components/InGameMenu'
import EquationAndAnswerInterface from '../components/UI/EquationAndAnswerInterface'
import Icon, {Check, Star, Fire, DailyChallenge} from '../components/Icon'
import {SOUND_CORRECT_DING, SOUND_WRONG} from '../lib/SoundHelper'
import useSoundPlayer from '../hooks/useSoundPlayer'
import useColorsControl from '../hooks/useColorsControl'

const NEXT_QUESTION_TIMEOUT = 2000
const ANIMATE_QUESTION_EASING = Easing.inOut(Easing.exp)

function GameMarathon() {
  const {shadow, red, green, yellow, orange} = useColorsControl()
  const dispatch = useDispatch()
  const {isAnimatingForCorrect, animation: answerReactionAnimation, animateCorrect, animateIncorrect} = useAnswerReactionResults()

  const {animation: nextQuestionAnimation, animate: animateNextQuestion, isAnimating: isAnimatingNextQuestion} = useAnimationStation()
  const {playSound} = useSoundPlayer()

  const userAnswer = useSelector(selectUserAnswer)
  const currentQuestion = useSelector(selectCurrentQuestion)
  const [countCorrect, setCountCorrect] = useState(0)
  const [hasAnsweredQuestion, setHasAnsweredQuestion] = useState(false)

  const handleGuess = () => {
    dispatch(recordAnswer(userAnswer))

    let result = new QuestionResult(currentQuestion, userAnswer)
    let correctAnswer = Equation.getSolution(currentQuestion.equation)
    if (QuestionResult.isCorrect(result)) {
      setHasAnsweredQuestion(true)
      setCountCorrect(countCorrect + 1)
      animateCorrect()
      playSound(SOUND_CORRECT_DING).then()
      dispatch(setAnswer(''))
      animateNextQuestion(
        NEXT_QUESTION_TIMEOUT,
        () => {
          dispatch(generateNewQuestion(correctAnswer))
        },
        ANIMATE_QUESTION_EASING,
      )
    } else {
      dispatch(setAnswer(''))
      playSound(SOUND_WRONG).then()
      animateIncorrect()
      animateNextQuestion(
        NEXT_QUESTION_TIMEOUT,
        () => {
          dispatch(goToScene(Scene_GameResults))
        },
        ANIMATE_QUESTION_EASING,
      )
    }
  }

  const handleGameStart = () => {
    dispatch(generateNewQuestion())
    animateCorrect()
  }

  return (
    <View style={styles.window}>
      <InGameMenu />
      {!currentQuestion && <GameStartTimer onStart={handleGameStart} />}
      <GameBackground animation={answerReactionAnimation} isAnimatingForCorrect={isAnimatingForCorrect} />
      <View style={styles.countsContains}>
        <Icon icon={DailyChallenge} color={red} />
        {countCorrect}
        {countCorrect === 0 ? null : countCorrect < 5 ? (
          <Icon icon={Check} color={green} />
        ) : countCorrect < 10 ? (
          <Icon icon={Star} color={yellow} />
        ) : (
          <Icon icon={Fire} color={orange} />
        )}
      </View>
      <View style={styles.equationContainer}>
        <EquationAndAnswerInterface
          onGuess={handleGuess}
          isAnimatingForCorrect={isAnimatingForCorrect}
          isAnimatingNextQuestion={isAnimatingNextQuestion}
          nextQuestionAnimation={nextQuestionAnimation}
          answerReactionAnimation={answerReactionAnimation}
          showTipAfterMS={!hasAnsweredQuestion ? 2000 : undefined}
        />
      </View>
      <View style={styles.calculatorContainer}>
        <CalculatorInput />
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

  countsContains: {
    paddingTop: spaceSmall,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default GameMarathon
