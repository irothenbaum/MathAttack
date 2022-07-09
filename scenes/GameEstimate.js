import React, {useState, useEffect} from 'react'
import {Animated, View, StyleSheet, Pressable} from 'react-native'
import InGameMenu from '../components/InGameMenu'
import {ScreenContainer} from '../styles/elements'
import {useDispatch, useSelector} from 'react-redux'
import {selectCurrentQuestion, selectGameSettings, selectUserAnswer} from '../redux/selectors'
import GameStartTimer from '../components/GameStartTimer'
import {generateNewEstimationQuestion, recordAnswer} from '../redux/GameSlice'
import EstimationInterface from '../components/UI/EstimationInterface'
import ComplexEquationComponent from '../components/ComplexEquationComponent'
import {spaceDefault, spaceLarge} from '../styles/layout'
import UIText from '../components/UIText'
import {dimmedGreen, dimmedRed, neonGreen, neonRed, shadow, shadowStrong, sunbeam, sunbeamStrong} from '../styles/colors'
import useDarkMode from '../hooks/useDarkMode'
import {font4} from '../styles/typography'
import GameBackground from '../components/FX/GameBackground'
import useClassicAnswerSystem from '../hooks/useClassicAnswerSystem'
import {setAnswer} from '../redux/UISlice'
import {getUIColor, getVibrateStylesForAnimation} from '../lib/utilities'
import Equation from '../models/Equation'
import EstimationQuestionResult from '../models/EstimationQuestionResult'
import RoundsRemainingUI from '../components/UI/RoundsRemainingUI'
import PerfectAnswerCelebration from '../components/UI/PerfectAnswerCelebration'
import {SOUND_CORRECT_CHIME, SOUND_CORRECT_DING, SOUND_WRONG} from '../lib/SoundHelper'
import useSoundPlayer from '../hooks/useSoundPlayer'

function GameEstimate() {
  const gameSettings = useSelector(selectGameSettings)
  const isDark = useDarkMode()
  const currentQuestion = useSelector(selectCurrentQuestion)
  const answer = useSelector(selectUserAnswer)
  const dispatch = useDispatch()
  const [tempAnswer, setTempAnswer] = useState(0)
  const [isPerfectAnswer, setIsPerfectAnswer] = useState(false)
  const {playSound} = useSoundPlayer()

  const {
    handleNextQuestion,
    animateIncorrect,
    animateCorrect,
    equationTimer,
    animation,
    isAnimatingForCorrect,
    isShowingAnswer,
    questionsRemaining,
  } = useClassicAnswerSystem(gameSettings.equationDuration, gameSettings.classicNumberOfRounds, generateNewEstimationQuestion)

  const handleGuess = () => {
    if (!currentQuestion || isShowingAnswer) {
      return
    }

    let result = new EstimationQuestionResult(currentQuestion, answer)
    dispatch(recordAnswer(answer))
    const isPerfect = EstimationQuestionResult.isPerfect(result)
    setIsPerfectAnswer(isPerfect)
    if (EstimationQuestionResult.isCorrect(result)) {
      animateCorrect()
      if (isPerfect) {
        playSound(SOUND_CORRECT_CHIME).then()
      } else {
        playSound(SOUND_CORRECT_DING).then()
      }
    } else {
      animateIncorrect()
      playSound(SOUND_WRONG).then()
    }
    handleNextQuestion()
  }

  const handleGameStart = () => {
    dispatch(generateNewEstimationQuestion())
    dispatch(setAnswer(0))
  }

  // when skipping the countdown:
  // useEffect(() => {
  //   handleGameStart()
  // }, [])

  const answerColor = isShowingAnswer
    ? isAnimatingForCorrect
      ? isDark
        ? dimmedGreen
        : neonGreen
      : isDark
      ? dimmedRed
      : neonRed
    : getUIColor(isDark)

  return (
    <View style={styles.window}>
      <InGameMenu />
      {!currentQuestion && <GameStartTimer onStart={handleGameStart} />}

      {!isPerfectAnswer && <GameBackground animation={animation} isAnimatingForCorrect={isAnimatingForCorrect} />}
      {isPerfectAnswer && isShowingAnswer && (
        <Animated.View
          style={[
            styles.perfectAnswer,
            {
              backgroundColor: isDark ? shadowStrong : sunbeamStrong,
              opacity: animation
                ? animation.interpolate({
                    inputRange: [0, 0.1],
                    outputRange: [0, 1],
                  })
                : 1,
            },
          ]}
        >
          <PerfectAnswerCelebration />
        </Animated.View>
      )}

      <RoundsRemainingUI style={{flexShrink: 0}} remaining={questionsRemaining} total={gameSettings.classicNumberOfRounds} />

      <View style={styles.innerContainer}>
        <Animated.View
          style={[
            styles.questionAndAnswerContainer,
            !!animation && !isAnimatingForCorrect ? getVibrateStylesForAnimation(animation, null, 0.25) : null,
          ]}
        >
          <View style={styles.questionContainer}>
            {currentQuestion && <ComplexEquationComponent equation={currentQuestion.equation} />}
          </View>
          <Pressable onPress={handleGuess} style={{width: '100%'}}>
            <View style={[styles.answerContainer, {borderColor: isDark ? sunbeam : shadow}]}>
              <UIText style={[styles.answerText, {color: answerColor}]}>
                {isShowingAnswer ? Equation.getSolution(currentQuestion.equation) : answer || tempAnswer}
              </UIText>
            </View>
          </Pressable>
        </Animated.View>
        <EstimationInterface
          onChangeTempAnswer={setTempAnswer}
          onSubmitAnswer={handleGuess}
          equationTimer={equationTimer}
          isAnimatingNextQuestion={isShowingAnswer}
          isAnimatingForCorrect={isAnimatingForCorrect}
          answerReactionAnimation={animation}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  window: {
    ...ScreenContainer,
  },

  innerContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
  },

  questionAndAnswerContainer: {
    flex: 1,
    height: '100%',
    padding: spaceDefault,
    alignItems: 'center',
  },

  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  answerContainer: {
    padding: spaceDefault,
    paddingRight: spaceLarge,
    borderTopWidth: 2,
    width: '100%',
    height: 100,
  },

  answerText: {
    textAlign: 'right',
    fontSize: font4,
  },

  perfectAnswer: {
    zIndex: 100,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default GameEstimate
