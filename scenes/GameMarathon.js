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
import {
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Animated,
} from 'react-native'
import GameStartTimer from '../components/GameStartTimer'
import GameBackground from '../components/FX/GameBackground'
import EquationBox from '../components/EquationBox'
import {getVibrateStylesForAnimation} from '../lib/utilities'
import TitleText from '../components/TitleText'
import {
  darkGrey,
  dimmedGreen,
  dimmedRed,
  nearWhite,
  neonGreen,
  neonRed,
} from '../styles/colors'
import Equation from '../models/Equation'
import CalculatorInput from '../components/UI/CalculatorInput'
import {RoundBox} from '../styles/elements'
import {spaceLarge} from '../styles/layout'
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import isDarkMode from '../hooks/isDarkMode'
import {font4} from '../styles/typography'
import animationStation from '../hooks/animationStation'

const NEXT_QUESTION_TIMEOUT = 2000

function GameMarathon() {
  const isDark = isDarkMode()
  const dispatch = useDispatch()
  const {
    isAnimatingForCorrect,
    animation: answerReactionAnimation,
    animateCorrect,
    animateIncorrect,
  } = answerReactionResults()

  const {
    animation: nextQuestionAnimation,
    animate: animateNextQuestion,
    isAnimating: isAnimatingNextQuestion,
  } = animationStation()

  const [strikes, setStrikes] = useState(3)
  const userInput = useSelector(selectUserInput)
  const userAnswer = useSelector(selectUserAnswer)
  const currentQuestion = useSelector(selectCurrentQuestion)

  const handleGuess = () => {
    dispatch(recordAnswer(userAnswer))

    let result = new QuestionResult(currentQuestion, userAnswer)
    let correctAnswer = Equation.getSolution(currentQuestion.equation)
    if (QuestionResult.isCorrect(result)) {
      animateCorrect()
      dispatch(setAnswer(''))
      animateNextQuestion(NEXT_QUESTION_TIMEOUT, () => {
        dispatch(generateNewQuestion(correctAnswer))
      })
    } else {
      let newStrikes = strikes - 1
      setStrikes(newStrikes)

      let hasStrikesRemaining = newStrikes > 0

      dispatch(setAnswer(''))
      animateIncorrect()
      animateNextQuestion(NEXT_QUESTION_TIMEOUT, () => {
        if (hasStrikesRemaining) {
          dispatch(generateNewQuestion(correctAnswer))
        } else {
          dispatch(goToScene(Scene_GameResults))
        }
      })
    }
  }

  const getColorForStrike = isActive => {
    return isActive
      ? isDark
        ? dimmedRed
        : neonRed
      : isDark
      ? darkGrey
      : nearWhite
  }

  return (
    <View style={styles.window}>
      {!currentQuestion && (
        <GameStartTimer onStart={() => dispatch(generateNewQuestion())} />
      )}
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
      <TouchableWithoutFeedback
        onPress={isAnimatingNextQuestion ? () => {} : handleGuess}>
        <View style={styles.equationContainer}>
          {!!currentQuestion && (
            <Animated.View
              style={
                isAnimatingNextQuestion && {
                  opacity: nextQuestionAnimation.interpolate({
                    inputRange: [0, 0.5, 0.6, 1],
                    outputRange: [1, 1, 0, 0],
                  }),
                }
              }>
              <EquationBox
                style={
                  !!answerReactionAnimation && !isAnimatingForCorrect
                    ? getVibrateStylesForAnimation(answerReactionAnimation)
                    : null
                }
                equation={currentQuestion.equation}
              />
            </Animated.View>
          )}

          <Animated.View
            style={[
              styles.answerBar,
              isAnimatingNextQuestion && {
                transform: [
                  {
                    translateY: nextQuestionAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 0, -162],
                    }),
                  },
                ],
              },
            ]}>
            <TitleText
              style={[
                styles.answerText,
                isAnimatingNextQuestion && {
                  color: isAnimatingForCorrect
                    ? isDark
                      ? dimmedGreen
                      : neonGreen
                    : isDark
                    ? dimmedRed
                    : neonRed,
                },
              ]}>
              {isAnimatingNextQuestion
                ? Equation.getSolution(currentQuestion.equation)
                : userInput || 0}
            </TitleText>
          </Animated.View>
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

  strikesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default GameMarathon
