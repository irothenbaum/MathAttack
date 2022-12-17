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
import {SOUND_BUTTON_CHIME, SOUND_WRONG} from '../lib/SoundHelper'
import {setAnswer} from '../redux/UISlice'
import CrescendoInterface from '../components/CrescendoInterface'
import useVibration from '../hooks/useVibration'
import {VIBRATE_ONCE_WRONG} from '../lib/VibrateHelper'

function GameCrescendo(props) {
  const dispatch = useDispatch()
  const currentQuestion = useSelector(selectCurrentQuestion)
  const gameSettings = useSelector(selectGameSettings)
  const {playSound} = useSoundPlayer()
  const {vibrateOnce} = useVibration()
  const round = useRef(1)

  const generateNextCrescendoQuestion = () => {
    const numberOfTermsToGuess = Math.max(1, Math.ceil(Math.log2(round.current)))
    // +1 because the first term is always given
    return generateNewCrescendoQuestion(numberOfTermsToGuess + 1)
  }

  const {handleNextQuestion, animateCorrect, animateIncorrect, equationTimer, animation, isAnimatingForCorrect, isShowingAnswer} =
    useClassicAnswerSystem(gameSettings.crescendoRoundDuration, gameSettings.crescendoRoundDuration, generateNextCrescendoQuestion)

  const handleGuess = (userAnswer) => {
    let result = new QuestionResult(currentQuestion, userAnswer)
    dispatch(recordAnswer(userAnswer))
    if (QuestionResult.isCorrect(result)) {
      animateCorrect()
      playSound(SOUND_BUTTON_CHIME).then()
      handleNextQuestion()
      round.current = round.current + 1
    } else {
      animateIncorrect()
      playSound(SOUND_WRONG).then()
      vibrateOnce(VIBRATE_ONCE_WRONG)
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
