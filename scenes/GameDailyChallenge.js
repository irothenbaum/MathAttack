import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  selectUserAnswer,
  selectCurrentQuestion,
  selectHighScoresForGame,
  selectCurrentSceneParams,
  selectGameSettings,
  selectLastGameResults,
} from '../redux/selectors'
import {recordAnswer, generateNewQuestion, setCurrentQuestion} from '../redux/GameSlice'
import QuestionResult from '../models/QuestionResult'
import {setAnswer} from '../redux/UISlice'
import useAnswerReactionResults from '../hooks/useAnswerReactionResults'
import {goToScene} from '../redux/NavigationSlice'
import {Scene_GameDailyChallenge, Scene_Menu} from '../constants/scenes'
import {StyleSheet, View} from 'react-native'
import GameBackground from '../components/FX/GameBackground'
import GameQuestion from '../models/GameQuestion'
import CalculatorInput from '../components/UI/CalculatorInput'
import {ScreenContainer} from '../styles/elements'
import {spaceDefault, spaceSmall, spaceLarge} from '../styles/layout'
import InGameMenu from '../components/InGameMenu'
import EquationAndAnswerInterface from '../components/UI/EquationAndAnswerInterface'
import Icon, {Check, Star, Fire, DailyChallenge, HighScores} from '../components/Icon'
import {SOUND_CORRECT_DING, SOUND_WRONG} from '../lib/SoundHelper'
import useSoundPlayer from '../hooks/useSoundPlayer'
import useColorsControl from '../hooks/useColorsControl'
import useVibration from '../hooks/useVibration'
import {VIBRATE_ONCE_WRONG} from '../lib/VibrateHelper'
import NormalText from '../components/NormalText'
import UIText from '../components/UIText'
import useDoOnceTimer from '../hooks/useDoOnceTimer'
import MenuButton from '../components/MenuButton'
import {recordHighScore} from '../redux/HighScoresSlice'
import GameResult from '../models/GameResult'
import {font1, font2} from '../styles/typography'
import AnswerReaction from '../components/FX/AnswerReaction'
import TitleText from '../components/TitleText'

const NEXT_QUESTION_TIMER = 'next-question-timer'
const NEXT_QUESTION_TIMEOUT = 1000

function GameDailyChallenge() {
  const sceneParams = useSelector(selectCurrentSceneParams)
  const {shadow, red, green, yellow, orange} = useColorsControl()
  const dispatch = useDispatch()
  const {isAnimatingForCorrect, animation: answerReactionAnimation, animateCorrect, animateIncorrect} = useAnswerReactionResults()
  const gameSettings = useSelector(selectGameSettings)
  const {setTimer, isTimerSet} = useDoOnceTimer()
  const {playSound} = useSoundPlayer()
  const {vibrateOnce} = useVibration()
  const previousScores = useSelector((state) => selectHighScoresForGame(state, Scene_GameDailyChallenge))
  // we store this to state so it doesn't change after we finnish this game
  const [prevHighest] = useState(previousScores.map((s) => s.questionResults.length).sort((a, b) => (a > b ? -1 : 1))[0] || 0)
  const [isGameOver, setIsGameOver] = useState(false)
  const results = useSelector(selectLastGameResults)

  const userAnswer = useSelector(selectUserAnswer)
  const currentQuestion = useSelector(selectCurrentQuestion)
  const [countCorrect, setCountCorrect] = useState(0)
  const [hasAnsweredQuestion, setHasAnsweredQuestion] = useState(false)

  useEffect(() => {
    if (!sceneParams || !sceneParams.equation) {
      // this shouldn't happen, but if it does we'll just make up a question
      dispatch(setCurrentQuestion(GameQuestion.getRandomFromSettings(gameSettings)))
    } else {
      // we want to start with the equation from the notification (sceneParams)
      dispatch(setCurrentQuestion(new GameQuestion(sceneParams.equation, Date.now(), Date.now() + gameSettings.equationDuration)))
    }
  }, [])

  const handleEndGame = () => {
    // if they didn't answer any just return to Menu
    if (results.length === 0) {
      return dispatch(goToScene(Scene_Menu))
    }

    dispatch(setAnswer(''))
    const gameResult = new GameResult(Scene_GameDailyChallenge, results, '')
    dispatch(recordHighScore(gameResult))
    setIsGameOver(true)
  }

  const handleGuess = () => {
    dispatch(recordAnswer(userAnswer))
    dispatch(setAnswer(''))

    let result = new QuestionResult(currentQuestion, userAnswer)
    if (QuestionResult.isCorrect(result)) {
      setHasAnsweredQuestion(true)
      setCountCorrect(countCorrect + 1)
      animateCorrect()
      playSound(SOUND_CORRECT_DING).then()
      setTimer(
        NEXT_QUESTION_TIMER,
        () => {
          dispatch(generateNewQuestion())
        },
        NEXT_QUESTION_TIMEOUT,
      )
    } else {
      playSound(SOUND_WRONG).then()
      vibrateOnce(VIBRATE_ONCE_WRONG)
      animateIncorrect(handleEndGame)
    }
  }

  return isGameOver ? (
    <View style={styles.window}>
      <View style={[styles.resultContainer, {marginTop: spaceLarge}]}>
        {countCorrect > prevHighest ? <Icon icon={HighScores} color={yellow} size={80} /> : <Icon icon={Fire} color={orange} size={80} />}
        <TitleText>Well done!</TitleText>
      </View>

      <View style={styles.resultContainer}>
        <NormalText style={styles.resultText}>
          You answered <UIText>{countCorrect}</UIText> correctly.
        </NormalText>

        {countCorrect < prevHighest ? (
          <NormalText style={styles.resultText}>
            Your previous best was {prevHighest}. Maybe the questions were harder this time?
          </NormalText>
        ) : countCorrect === prevHighest ? (
          <NormalText style={styles.resultText}>You tied your previous best! That's something to be proud of.</NormalText>
        ) : (
          <NormalText style={styles.resultText}>You beat your previous best score of {prevHighest}. Incredible job!</NormalText>
        )}
      </View>

      <View style={styles.resultContainer}>
        <NormalText style={[styles.resultText, {fontSize: font1}]}>
          You can only play the Daily Challenge once per day. But keep your training going with some other games!
        </NormalText>
        <View>
          <MenuButton title={'Back to menu'} blurCount={3} onPress={() => dispatch(goToScene(Scene_Menu))} />
        </View>
      </View>
    </View>
  ) : (
    <View style={styles.window}>
      <InGameMenu onEnd={handleEndGame} />
      <GameBackground animation={answerReactionAnimation} isAnimatingForCorrect={isAnimatingForCorrect} />
      <View style={{width: '100%'}}>
        <View style={styles.countsContains}>
          <UIText style={styles.correctCount}>Correct: {countCorrect}</UIText>
          {countCorrect === 0 ? (
            <Icon icon={HighScores} color={'transparent'} />
          ) : countCorrect < 5 ? (
            <Icon icon={Check} color={green} />
          ) : (
            <Icon icon={Fire} color={orange} />
          )}
        </View>
        <View style={styles.bestTextContainer}>
          <NormalText>Best: {Math.max(countCorrect, prevHighest)}</NormalText>
          {countCorrect > prevHighest ? <Icon style={{marginLeft: spaceSmall}} icon={HighScores} color={yellow} size={font2} /> : null}
        </View>
      </View>
      <View style={styles.equationContainer}>
        {isTimerSet(NEXT_QUESTION_TIMER) ? <AnswerReaction duration={NEXT_QUESTION_TIMEOUT} /> : null}
        <EquationAndAnswerInterface
          onGuess={handleGuess}
          isAnimatingForCorrect={isAnimatingForCorrect}
          answerReactionAnimation={answerReactionAnimation}
          showTipAfterMS={!hasAnsweredQuestion ? 2000 : undefined}
        />
      </View>
      <View style={styles.calculatorContainer}>
        <CalculatorInput />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  window: {...ScreenContainer},

  correctCount: {
    marginHorizontal: spaceSmall,
  },

  bestTextContainer: {
    marginTop: spaceSmall,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  equationContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  calculatorContainer: {
    flex: 1,
  },

  countsContains: {
    paddingTop: spaceSmall,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  resultContainer: {
    width: '100%',
    flex: 1,
    padding: spaceDefault,
    alignItems: 'center',
  },

  resultText: {
    width: '100%',
    marginBottom: spaceDefault,
  },
})

export default GameDailyChallenge
