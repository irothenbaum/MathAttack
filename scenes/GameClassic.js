import React from 'react'
import {View, StyleSheet} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {selectUserAnswer, selectCurrentQuestion, selectGameSettings} from '../redux/selectors'
import {generateNewQuestion, recordAnswer} from '../redux/GameSlice'
import CalculatorInput from '../components/UI/CalculatorInput'
import GameBackground from '../components/FX/GameBackground'
import {ScreenContainer} from '../styles/elements'
import GameStartTimer from '../components/GameStartTimer'
import InGameMenu from '../components/InGameMenu'
import EquationAndAnswerInterface from '../components/UI/EquationAndAnswerInterface'
import useAutoSubmit from '../hooks/useAutoSubmit'
import useClassicAnswerSystem from '../hooks/useClassicAnswerSystem'
import QuestionResult from '../models/QuestionResult'
import {setAnswer} from '../redux/UISlice'
import RoundsRemainingUI from '../components/UI/RoundsRemainingUI'
import useSoundPlayer from '../hooks/useSoundPlayer'
import {SOUND_CORRECT_DING, SOUND_WRONG} from '../lib/SoundHelper'

function GameClassic() {
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
    questionsRemaining,
  } = useClassicAnswerSystem(gameSettings.equationDuration, gameSettings.classicNumberOfRounds, generateNewQuestion)

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
      <RoundsRemainingUI remaining={questionsRemaining} total={gameSettings.classicNumberOfRounds} />

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
