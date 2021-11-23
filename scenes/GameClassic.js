import React, {useCallback, useState} from 'react'
import {Alert, View, Text, StyleSheet} from 'react-native'
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

function GameClassic() {
  const dispatch = useDispatch()
  const userAnswer = useSelector(selectUserAnswer)
  const currentQuestion = GameQuestion.createFromPlainObject(
    useSelector(selectCurrentQuestion),
  )

  console.log('Render')

  const gameSettings = useSelector(selectClassicGameSettings)

  const [questionsRemaining, setQuestionsRemaining] = useState(
    gameSettings.classicNumberOfRounds,
  )

  const handleNextQuestion = useCallback(() => {
    if (questionsRemaining > 0) {
      dispatch(generateNewQuestion())
      setQuestionsRemaining(questionsRemaining - 1)
    } else {
      // TODO: handle end game
      Alert.alert(null, 'GAME OVER!')
    }
  }, [dispatch, questionsRemaining, setQuestionsRemaining])

  const handleGuess = useCallback(() => {
    let result = new QuestionResult(currentQuestion, userAnswer)
    if (result.isCorrect()) {
      dispatch(recordAnswer(userAnswer))
      handleNextQuestion()
    } else {
      dispatch(
        // cut the time remaining in half
        deductTimeRemaining((currentQuestion.expiresAt - Date.now()) / 2),
      )
    }
  }, [dispatch, currentQuestion, userAnswer, handleNextQuestion])

  const handleTimeout = useCallback(() => {
    dispatch(recordAnswer(ANSWER_TIMEOUT))
    handleNextQuestion()
  }, [dispatch, handleNextQuestion])

  return (
    <View style={styles.window}>
      <View style={styles.equationContainer}>
        <EquationBox
          onPress={handleGuess}
          onTimeout={handleTimeout}
          question={currentQuestion}
        />
      </View>
      <View style={styles.calculatorContainer}>
        <CalculatorInput />
      </View>
    </View>
  )
}

export default GameClassic
