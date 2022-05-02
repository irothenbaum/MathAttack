import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  selectUserAnswer,
  selectCurrentQuestion,
  selectUserInput,
} from '../redux/selectors'
import {recordAnswer, generateNewQuestion} from '../redux/GameSlice'
import QuestionResult from '../models/QuestionResult'
import {setAnswer} from '../redux/UISlice'
import useAnswerReactionResults from '../hooks/useAnswerReactionResults'
import {goToScene} from '../redux/NavigationSlice'
import {Scene_GameResults} from '../constants/scenes'
import {StyleSheet, View, Easing} from 'react-native'
import GameStartTimer from '../components/GameStartTimer'
import GameBackground from '../components/FX/GameBackground'
import {dimmedRed, neonRed, shadow, sunbeam} from '../styles/colors'
import Equation from '../models/Equation'
import CalculatorInput from '../components/UI/CalculatorInput'
import {RoundBox, ScreenContainer} from '../styles/elements'
import {spaceLarge, spaceSmall} from '../styles/layout'
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import isDarkMode from '../hooks/isDarkMode'
import {font4} from '../styles/typography'
import useAnimationStation from '../hooks/useAnimationStation'
import InGameMenu from '../components/InGameMenu'
import EquationAndAnswerInterface from '../components/UI/EquationAndAnswerInterface'

const NEXT_QUESTION_TIMEOUT = 2000
const ANIMATE_QUESTION_EASING = Easing.inOut(Easing.exp)

function GameMarathon() {
  const isDark = isDarkMode()
  const dispatch = useDispatch()
  const {
    isAnimatingForCorrect,
    animation: answerReactionAnimation,
    animateCorrect,
    animateIncorrect,
  } = useAnswerReactionResults()

  const {
    animation: nextQuestionAnimation,
    animate: animateNextQuestion,
    isAnimating: isAnimatingNextQuestion,
  } = useAnimationStation()

  const [strikes, setStrikes] = useState(3)
  const userAnswer = useSelector(selectUserAnswer)
  const currentQuestion = useSelector(selectCurrentQuestion)

  const handleGuess = () => {
    dispatch(recordAnswer(userAnswer))

    let result = new QuestionResult(currentQuestion, userAnswer)
    let correctAnswer = Equation.getSolution(currentQuestion.equation)
    if (QuestionResult.isCorrect(result)) {
      animateCorrect()
      dispatch(setAnswer(''))
      animateNextQuestion(
        NEXT_QUESTION_TIMEOUT,
        () => {
          dispatch(generateNewQuestion(correctAnswer))
        },
        ANIMATE_QUESTION_EASING,
      )
    } else {
      let newStrikes = strikes - 1
      setStrikes(newStrikes)

      let hasStrikesRemaining = newStrikes > 0

      dispatch(setAnswer(''))
      animateIncorrect()
      animateNextQuestion(
        NEXT_QUESTION_TIMEOUT,
        () => {
          if (hasStrikesRemaining) {
            dispatch(setAnswer(''))
            dispatch(generateNewQuestion(correctAnswer))
          } else {
            dispatch(goToScene(Scene_GameResults))
          }
        },
        ANIMATE_QUESTION_EASING,
      )
    }
  }

  const handleGameStart = () => {
    dispatch(generateNewQuestion())
    animateCorrect()
  }

  const getColorForStrike = isActive => {
    return isActive ? (isDark ? dimmedRed : neonRed) : isDark ? sunbeam : shadow
  }

  return (
    <View style={styles.window}>
      <InGameMenu />
      {!currentQuestion && <GameStartTimer onStart={handleGameStart} />}
      <GameBackground
        animation={answerReactionAnimation}
        isAnimatingForCorrect={isAnimatingForCorrect}
      />
      <View style={styles.strikesContainer}>
        <FontAwesomeIcon
          icon={faTimes}
          size={font4}
          color={getColorForStrike(strikes < 3)}
        />
        <FontAwesomeIcon
          icon={faTimes}
          size={font4}
          color={getColorForStrike(strikes < 2)}
        />
        <FontAwesomeIcon
          icon={faTimes}
          size={font4}
          color={getColorForStrike(strikes < 1)}
        />
      </View>
      <EquationAndAnswerInterface
        onGuess={handleGuess}
        isAnimatingForCorrect={isAnimatingForCorrect}
        isAnimatingNextQuestion={isAnimatingNextQuestion}
        nextQuestionAnimation={nextQuestionAnimation}
        answerReactionAnimation={answerReactionAnimation}
      />
      <View style={styles.calculatorContainer}>
        <CalculatorInput />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  window: {...ScreenContainer},

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

  strikesContainer: {
    paddingTop: spaceSmall,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default GameMarathon
