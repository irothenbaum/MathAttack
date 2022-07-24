import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {selectCurrentQuestion, selectGameSettings, selectUserAnswer} from '../redux/selectors'
import {StyleSheet, View} from 'react-native'
import {ScreenContainer} from '../styles/elements'
import InGameMenu from '../components/InGameMenu'
import GameStartTimer from '../components/GameStartTimer'
import GameBackground from '../components/FX/GameBackground'
import RoundsRemainingUI from '../components/UI/RoundsRemainingUI'
import EquationAndAnswerInterface from '../components/UI/EquationAndAnswerInterface'
import CalculatorInput from '../components/UI/CalculatorInput'
import useSoundPlayer from '../hooks/useSoundPlayer'
import useClassicAnswerSystem from '../hooks/useClassicAnswerSystem'
import {generateNewQuestion, recordAnswer} from '../redux/GameSlice'
import QuestionResult from '../models/QuestionResult'
import {SOUND_CORRECT_DING, SOUND_WRONG} from '../lib/SoundHelper'
import {setAnswer} from '../redux/UISlice'
import useAutoSubmit from '../hooks/useAutoSubmit'
import CrescendoInterface from '../components/CrescendoInterface'

// lol, basically
const INFINITE = 9999999

function GameCrescendo(props) {
  const dispatch = useDispatch()
  const userAnswer = useSelector(selectUserAnswer)
  const currentQuestion = useSelector(selectCurrentQuestion)
  const gameSettings = useSelector(selectGameSettings)
  const {playSound} = useSoundPlayer()

  const {
    handleNextQuestion,
    animateCorrect,
    animateIncorrect,
    markLastGuess,
    equationTimer,
    animation,
    isAnimatingForCorrect,
    isShowingAnswer,
  } = useClassicAnswerSystem(gameSettings.crescendoRoundDuration, INFINITE, generateNewQuestion)

  const handleGuess = () => {
    let result = new QuestionResult(currentQuestion, userAnswer)
    if (QuestionResult.isCorrect(result)) {
      dispatch(recordAnswer(userAnswer))
      animateCorrect()
      playSound(SOUND_CORRECT_DING).then()
      handleNextQuestion()
    } else {
      markLastGuess(userAnswer)
      playSound(SOUND_WRONG).then()
      animateIncorrect()
    }

    dispatch(setAnswer(''))
  }
  useAutoSubmit(handleGuess)

  const handleGameStart = () => {
    dispatch(generateNewQuestion())
    animateCorrect()
  }

  return (
    <View style={styles.window}>
      <InGameMenu />
      {!currentQuestion && <GameStartTimer onStart={handleGameStart} />}
      <GameBackground animation={animation} isAnimatingForCorrect={isAnimatingForCorrect} />

      <CrescendoInterface equation={currentQuestion.equation} />
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

export default GameCrescendo
