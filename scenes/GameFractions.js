import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {selectCurrentQuestion, selectGameSettings, selectUserAnswer} from '../redux/selectors'
import useColorsControl from '../hooks/useColorsControl'
import useSoundPlayer from '../hooks/useSoundPlayer'
import useVibration from '../hooks/useVibration'
import useClassicAnswerSystem from '../hooks/useClassicAnswerSystem'
import {generateNewFractionsQuestion, recordAnswer} from '../redux/GameSlice'
import FractionQuestionResult from '../models/FractionQuestionResult'
import {SOUND_CORRECT_CHIME, SOUND_CORRECT_DING, SOUND_WRONG} from '../lib/SoundHelper'
import {VIBRATE_ONCE_WRONG} from '../lib/VibrateHelper'
import {setAnswer} from '../redux/UISlice'
import {Animated, Pressable, StyleSheet, View} from 'react-native'
import InGameMenu from '../components/InGameMenu'
import GameStartTimer from '../components/GameStartTimer'
import GameBackground from '../components/FX/GameBackground'
import PerfectAnswerCelebration from '../components/UI/PerfectAnswerCelebration'
import RoundsRemainingUI from '../components/UI/RoundsRemainingUI'
import {getVibrateStylesForAnimation} from '../lib/utilities'
import UIText from '../components/UIText'
import Equation from '../models/Equation'
import FractionInterface from '../components/UI/FractionInterface'
import {ScreenContainer} from '../styles/elements'
import {spaceDefault, spaceLarge, spaceSmall} from '../styles/layout'
import {font4} from '../styles/typography'
import Phrase from '../models/Phrase'
import TitleText from '../components/TitleText'

function GameFractions(props) {
  const gameSettings = useSelector(selectGameSettings)
  const {shadow, sunbeamStrong, foreground, getResultColor} = useColorsControl()
  const currentQuestion = useSelector(selectCurrentQuestion)
  const answer = useSelector(selectUserAnswer)
  const dispatch = useDispatch()
  const [tempAnswer, setTempAnswer] = useState(0)
  const [isPerfectAnswer, setIsPerfectAnswer] = useState(false)
  const {playSound} = useSoundPlayer()
  const {vibrateOnce} = useVibration()

  const {
    handleNextQuestion,
    animateIncorrect,
    animateCorrect,
    equationTimer,
    animation,
    isAnimatingForCorrect,
    isShowingAnswer,
    questionsRemaining,
  } = useClassicAnswerSystem(gameSettings.equationDuration, gameSettings.classicNumberOfRounds, generateNewFractionsQuestion)

  const handleGuess = () => {
    if (!currentQuestion || isShowingAnswer) {
      return
    }

    let result = new FractionQuestionResult(currentQuestion, answer)
    dispatch(recordAnswer(answer))
    const isPerfect = FractionQuestionResult.isPerfect(result)
    setIsPerfectAnswer(isPerfect)
    if (FractionQuestionResult.isCorrect(result)) {
      animateCorrect()
      if (isPerfect) {
        playSound(SOUND_CORRECT_CHIME).then()
      } else {
        playSound(SOUND_CORRECT_DING).then()
      }
    } else {
      animateIncorrect()
      playSound(SOUND_WRONG).then()
      vibrateOnce(VIBRATE_ONCE_WRONG)
    }
    handleNextQuestion()
  }

  const handleGameStart = () => {
    dispatch(generateNewFractionsQuestion())
    dispatch(setAnswer(0))
  }

  const answerColor = isShowingAnswer ? getResultColor(isAnimatingForCorrect) : foreground
  const [numerator, denominator] = currentQuestion ? Phrase.getDiscreteTerms(currentQuestion.equation.phrase) : [0, 0]

  const formattedAnswerValue = (isShowingAnswer ? Equation.getSolution(currentQuestion.equation) : answer || tempAnswer).toFixed(2)

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
              backgroundColor: sunbeamStrong,
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
        <View style={styles.questionAndAnswerContainer}>
          <View style={styles.questionContainer}>
            {currentQuestion && (
              <Animated.View
                style={[
                  styles.questionContainer,
                  !!animation && !isAnimatingForCorrect ? getVibrateStylesForAnimation(animation, null, 0.25) : null,
                ]}
              >
                <TitleText>{numerator}</TitleText>
                <View style={[styles.divider, {backgroundColor: foreground}]} />
                <TitleText>{denominator}</TitleText>
              </Animated.View>
            )}
          </View>
          <FractionInterface
            onChangeTempAnswer={setTempAnswer}
            onSubmitAnswer={handleGuess}
            equationTimer={equationTimer}
            isAnimatingNextQuestion={isShowingAnswer}
            isAnimatingForCorrect={isAnimatingForCorrect}
            answerReactionAnimation={animation}
          />
          <Pressable onPress={handleGuess} style={{width: '100%'}}>
            <View style={[styles.answerContainer, {borderColor: shadow}]}>
              <UIText style={[styles.answerText, {color: answerColor}]}>{formattedAnswerValue}</UIText>
            </View>
          </Pressable>
        </View>
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
    marginTop: spaceDefault,
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

  divider: {
    width: '30%',
    height: 6,
    marginVertical: spaceSmall,
  },
})

export default GameFractions
