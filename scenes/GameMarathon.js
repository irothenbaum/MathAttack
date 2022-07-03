import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {selectUserAnswer, selectCurrentQuestion, selectUserInput, selectGameSettings} from '../redux/selectors'
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
import isDarkMode from '../hooks/isDarkMode'
import {font4} from '../styles/typography'
import useAnimationStation from '../hooks/useAnimationStation'
import InGameMenu from '../components/InGameMenu'
import EquationAndAnswerInterface from '../components/UI/EquationAndAnswerInterface'
import Icon, {X} from '../components/Icon'
import {SOUND_CORRECT_DING, SOUND_WRONG} from '../lib/SoundHelper'
import useSoundPlayer from '../hooks/useSoundPlayer'

const NEXT_QUESTION_TIMEOUT = 2000
const ANIMATE_QUESTION_EASING = Easing.inOut(Easing.exp)

function GameMarathon() {
  const isDark = isDarkMode()
  const dispatch = useDispatch()
  const {isAnimatingForCorrect, animation: answerReactionAnimation, animateCorrect, animateIncorrect} = useAnswerReactionResults()

  const {animation: nextQuestionAnimation, animate: animateNextQuestion, isAnimating: isAnimatingNextQuestion} = useAnimationStation()
  const {playSound} = useSoundPlayer()

  const userAnswer = useSelector(selectUserAnswer)
  const currentQuestion = useSelector(selectCurrentQuestion)
  const settings = useSelector(selectGameSettings)
  const [strikes, setStrikes] = useState(settings.numberOfStrikes)

  const handleGuess = () => {
    dispatch(recordAnswer(userAnswer))

    let result = new QuestionResult(currentQuestion, userAnswer)
    let correctAnswer = Equation.getSolution(currentQuestion.equation)
    if (QuestionResult.isCorrect(result)) {
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
      let newStrikes = strikes - 1
      setStrikes(newStrikes)

      let hasStrikesRemaining = newStrikes > 0

      dispatch(setAnswer(''))
      playSound(SOUND_WRONG).then()
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

  const getColorForStrike = (isActive) => {
    return isActive ? (isDark ? dimmedRed : neonRed) : isDark ? sunbeam : shadow
  }

  return (
    <View style={styles.window}>
      <InGameMenu />
      {!currentQuestion && <GameStartTimer onStart={handleGameStart} />}
      <GameBackground animation={answerReactionAnimation} isAnimatingForCorrect={isAnimatingForCorrect} />
      <View style={styles.strikesContainer}>
        <Icon icon={X} size={font4} color={getColorForStrike(strikes < 3)} />
        <Icon icon={X} size={font4} color={getColorForStrike(strikes < 2)} />
        <Icon icon={X} size={font4} color={getColorForStrike(strikes < 1)} />
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
