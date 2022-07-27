import React, {useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {selectCurrentQuestion, selectGameSettings} from '../redux/selectors'
import {StyleSheet, View} from 'react-native'
import {ScreenContainer} from '../styles/elements'
import InGameMenu from '../components/InGameMenu'
import GameStartTimer from '../components/GameStartTimer'
import GameBackground from '../components/FX/GameBackground'
import useSoundPlayer from '../hooks/useSoundPlayer'
import useClassicAnswerSystem from '../hooks/useClassicAnswerSystem'
import {generateNewCrescendoQuestion, recordAnswer} from '../redux/GameSlice'
import QuestionResult from '../models/QuestionResult'
import {SOUND_CORRECT_DING, SOUND_WRONG} from '../lib/SoundHelper'
import {setAnswer} from '../redux/UISlice'
import CrescendoInterface, {MAX_FAKES_PER_ROW} from '../components/CrescendoInterface'

// lol, basically
const INFINITE = 9999999

function GameCrescendo(props) {
  const dispatch = useDispatch()
  const currentQuestion = useSelector(selectCurrentQuestion)
  const gameSettings = useSelector(selectGameSettings)
  const {playSound} = useSoundPlayer()
  const round = useRef(1)

  const generateNextCrescendoQuestion = () => {
    console.log('GENERATING QUESTIONS, round: ' + round.current)
    return generateNewCrescendoQuestion(Math.ceil(round.current / MAX_FAKES_PER_ROW) + 1)
  }

  const {
    handleNextQuestion,
    animateCorrect,
    animateIncorrect,
    markLastGuess,
    equationTimer,
    animation,
    isAnimatingForCorrect,
    isShowingAnswer,
  } = useClassicAnswerSystem(gameSettings.crescendoRoundDuration, INFINITE, generateNextCrescendoQuestion)

  const handleGuess = (userAnswer) => {
    console.log('GUESS HANDLED ' + userAnswer)
    let result = new QuestionResult(currentQuestion, userAnswer)
    if (QuestionResult.isCorrect(result)) {
      dispatch(recordAnswer(userAnswer))
      animateCorrect()
      playSound(SOUND_CORRECT_DING).then()
      handleNextQuestion()
      round.current = round.current + 1
    } else {
      markLastGuess(userAnswer)
      playSound(SOUND_WRONG).then()
      animateIncorrect()
      handleNextQuestion(true)
    }

    dispatch(setAnswer(''))
  }

  const handleGameStart = () => {
    dispatch(generateNextCrescendoQuestion())
    animateCorrect()
  }

  return (
    <View style={styles.window}>
      <InGameMenu />
      {!currentQuestion && <GameStartTimer onStart={handleGameStart} />}
      <GameBackground animation={animation} isAnimatingForCorrect={isAnimatingForCorrect} />

      {currentQuestion && (
        <CrescendoInterface
          equation={currentQuestion.equation}
          difficulty={round.current}
          onSubmitAnswer={handleGuess}
          isShowingResult={isShowingAnswer}
          isResultCorrect={isAnimatingForCorrect}
          resultAnimation={animation}
          equationTimer={equationTimer}
        />
      )}
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
