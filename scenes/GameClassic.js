import React, {useState} from 'react'
import {Alert, View, StyleSheet} from 'react-native'
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
import {setAnswer} from '../redux/UISlice'
import Glitter from '../components/FX/Glitter'

const styles = StyleSheet.create({
  window: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },

  equationContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  calculatorContainer: {
    flex: 2,
  },
})

const GLITTER_DURATION = 1000
const GLITTER_AMOUNT = 20

function GameClassic() {
  const dispatch = useDispatch()
  const userAnswer = useSelector(selectUserAnswer)
  const currentQuestion = GameQuestion.createFromPlainObject(
    useSelector(selectCurrentQuestion),
  )
  const gameSettings = useSelector(selectClassicGameSettings)

  const [glitteringTimeout, setGlitteringTimeout] = useState(null)
  const [questionsRemaining, setQuestionsRemaining] = useState(
    gameSettings.classicNumberOfRounds,
  )

  const celebrate = () => {
    if (glitteringTimeout) {
      clearTimeout(glitteringTimeout)
    }
    setGlitteringTimeout(
      setTimeout(() => setGlitteringTimeout(null), GLITTER_DURATION),
    )
  }

  const handleNextQuestion = () => {
    // always reset the input
    dispatch(setAnswer(''))

    if (questionsRemaining > 0) {
      dispatch(generateNewQuestion())
      setQuestionsRemaining(questionsRemaining - 1)
    } else {
      // TODO: handle end game
      Alert.alert(null, 'GAME OVER!')
    }
  }

  const handleGuess = () => {
    let result = new QuestionResult(currentQuestion, userAnswer)
    if (result.isCorrect()) {
      dispatch(recordAnswer(userAnswer))
      celebrate()
      handleNextQuestion()
    } else {
      dispatch(
        // cut the time remaining in half
        deductTimeRemaining((currentQuestion.expiresAt - Date.now()) / 2),
      )
    }
  }

  const handleTimeout = () => {
    dispatch(recordAnswer(ANSWER_TIMEOUT))
    handleNextQuestion()
  }

  return (
    <View style={styles.window}>
      <View style={styles.equationContainer}>
        {!!currentQuestion && (
          <EquationBox
            key={`${currentQuestion.equation.getSolution()}::${questionsRemaining}`}
            onPress={handleGuess}
            onTimeout={handleTimeout}
            equationStr={currentQuestion.equation.getLeftSide()}
            timeRemaining={currentQuestion.getMSRemaining()}
          />
        )}
        {glitteringTimeout && (
          <Glitter
            key={glitteringTimeout}
            amount={GLITTER_AMOUNT}
            duration={GLITTER_DURATION}
          />
        )}
      </View>
      <View style={styles.calculatorContainer}>
        <CalculatorInput />
      </View>
    </View>
  )
}

export default GameClassic
