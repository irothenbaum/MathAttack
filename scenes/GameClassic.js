import React, {useState, useRef, useEffect, useCallback} from 'react'
import {Alert, View, StyleSheet, Animated, Easing} from 'react-native'
import EquationBox from '../components/EquationBox'
import {useDispatch, useSelector} from 'react-redux'
import {
  selectUserAnswer,
  selectCurrentQuestion,
  selectClassicGameSettings,
} from '../redux/selectors'
import {
  deductTimeRemaining,
  recordAnswer,
  generateNewQuestion,
} from '../redux/GameClassicSlice'
import {ANSWER_TIMEOUT} from '../constants/game'
import CalculatorInput from '../components/UI/CalculatorInput'
import QuestionResult from '../models/QuestionResult'
import GameQuestion from '../models/GameQuestion'
import {setAnswer} from '../redux/UISlice'
import {white, neonGreen, neonRed, nearWhite} from '../styles/colors'
import answerReactionResults from '../hooks/answerReactionResults'
import doOnceTimer from '../hooks/doOnceTimer'
import {goToScene} from '../redux/NavigationSlice'
import {Scene_Menu} from '../constants/scenes'
import {getVibrateStylesForAnimation} from '../lib/utilities'
import animationStation from '../hooks/animationStation'
// import {v4 as uuid} from 'uuid'

function uuid() {
  return '' + Date.now()
}

const CHANGE_ANSWER_DELAY = 500

function GameClassic() {
  const dispatch = useDispatch()
  const {animation: equationTimer} = animationStation()
  const {isAnimatingForCorrect, animation, animateCorrect, animateIncorrect} =
    answerReactionResults()
  const userAnswer = useSelector(selectUserAnswer)
  const currentQuestionRaw = useSelector(selectCurrentQuestion)
  const currentQuestion = GameQuestion.createFromPlainObject(currentQuestionRaw)
  const [isChangingAnswers, setIsChangingAnswers] = useState(false)
  const {setTimer} = doOnceTimer()
  const gameSettings = useSelector(selectClassicGameSettings)

  const [questionsRemaining, setQuestionsRemaining] = useState(
    gameSettings.classicNumberOfRounds,
  )

  useEffect(() => {
    if (currentQuestionRaw) {
      let q = GameQuestion.createFromPlainObject(currentQuestionRaw)
      let amountRemaining = q.getMSRemaining() / gameSettings.equationDuration
      // TODO: Restart the equationTimer animation from here, handle timeout internally
    } else {
    }
  }, [currentQuestionRaw])

  const handleNextQuestion = () => {
    // always reset the input
    dispatch(setAnswer(''))
    if (questionsRemaining > 0) {
      dispatch(generateNewQuestion())
      setQuestionsRemaining(questionsRemaining - 1)
    } else {
      // TODO: handle end game
      Alert.alert(null, 'GAME OVER!')
      dispatch(goToScene(Scene_Menu))
    }
  }

  const handleGuess = () => {
    let result = new QuestionResult(currentQuestion, userAnswer)
    if (result.isCorrect()) {
      dispatch(recordAnswer(userAnswer))
      animateCorrect()
      handleNextQuestion()
    } else {
      dispatch(setAnswer(''))
      animateIncorrect()
      /*
      dispatch(
        // cut the time remaining by 25%
        deductTimeRemaining((currentQuestion.expiresAt - Date.now()) * 0.75),
      )*/
    }
  }

  const handleTimeout = () => {
    console.log('TIMEOUT')
    dispatch(recordAnswer(ANSWER_TIMEOUT))
    animateIncorrect()
    handleNextQuestion()
  }

  return (
    <View style={styles.window}>
      {!!animation && (
        <Animated.View
          style={[
            styles.celebrationBG,
            {
              backgroundColor: isAnimatingForCorrect ? neonGreen : neonRed,
              opacity: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            },
          ]}
        />
      )}
      <View style={styles.equationContainer}>
        {!!currentQuestion && (
          <EquationBox
            style={
              !!animation && !isAnimatingForCorrect
                ? getVibrateStylesForAnimation(animation)
                : null
            }
            key={`${currentQuestion.equation.getSolution()}::${questionsRemaining}`}
            onPress={handleGuess}
            onTimeout={handleTimeout}
            equationStr={
              isChangingAnswers ? null : currentQuestion.equation.getLeftSide()
            }
            timerAnimation={
              !!animation && isAnimatingForCorrect ? null : equationTimer
            }
          />
        )}
      </View>
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
    backgroundColor: nearWhite,
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
