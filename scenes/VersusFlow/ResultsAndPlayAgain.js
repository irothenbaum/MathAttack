import React, {useEffect, useState} from 'react'
import {StyleSheet, View, Animated} from 'react-native'
import {FullScreenOverlay, ScreenContainer} from '../../styles/elements'
import TitleText from '../../components/TitleText'
import PropTypes from 'prop-types'
import {EVENT_MarkReady, WON_FLAG_WON, WON_FLAG_LOST} from '../../constants/versus'
import NormalText from '../../components/NormalText'
import {useSelector} from 'react-redux'
import {selectLastGameResults} from '../../redux/selectors'
import QuestionResult from '../../models/QuestionResult'
import Equation from '../../models/Equation'
import MenuButton from '../../components/MenuButton'
import DividerLine from '../../components/DividerLine'
import useAnimationStation from '../../hooks/useAnimationStation'
import {spaceLarge, spaceExtraLarge} from '../../styles/layout'
import Icon, {Check, Question} from '../../components/Icon'
import VersusSocket from '../../lib/VersusSocket'
import useColorsControl from '../../hooks/useColorsControl'

// FOR TESTING:
// import GameQuestion from '../../models/GameQuestion'
// import Phrase from '../../models/Phrase'
// import {serializeObject} from '../../lib/utilities'

// const testProps = {
//   myName: 'Left',
//   myScore: 1,
//   onPlayAgain: () => {
//     console.log('PLAY AGAIN')
//   },
//   opponentName: 'Right',
//   opponentScore: 0,
//   socket: {
//     off: () => {},
//     on: () => {
//       console.log('ON')
//     },
//   },
//   wonFlag: 1,
// }

const FADE_REVEAL = 1000
const SCORE_REVEAL = 500

function ResultsAndPlayAgain(props) {
  const [isFadingOut, setIsFadingOut] = useState(true)
  const [isOpponentReady, setIsOpponentReady] = useState(false)
  const [amIReady, setAmIReady] = useState(false)
  const {green, backgroundColor, grey} = useColorsControl()
  const {animate: fadeOut, animation: fadeOutAnimation, isAnimating: isAnimatingFadeOut} = useAnimationStation()

  const [isScoreUpdate, setIsScoreUpdated] = useState(false)
  const {animate: animateScore, animation: scoreAnimation, isAnimating: isAnimatingScore} = useAnimationStation()

  const results = useSelector(selectLastGameResults)
  // FOR TESTING:
  // const results = [
  //   serializeObject(new QuestionResult(new GameQuestion(new Equation(new Phrase(12, '+', 5)), Date.now(), Date.now()), 5, 100)),
  // ]
  const lastResult = results[results.length - 1]

  const handlePlayAgain = () => {
    props.socket.broadcastReady()
    setAmIReady(true)
  }

  useEffect(() => {
    fadeOut(FADE_REVEAL, () => setIsFadingOut(false))

    setTimeout(() => {
      animateScore(SCORE_REVEAL, () => setIsScoreUpdated(true))
    }, FADE_REVEAL)

    const readyListener = props.socket.on(EVENT_MarkReady, () => {
      setIsOpponentReady(true)
    })

    return () => {
      props.socket.off(readyListener)
    }
  }, [])

  useEffect(() => {
    if (amIReady && isOpponentReady) {
      props.onPlayAgain()
    }
  }, [amIReady, isOpponentReady])

  let wonText = ''

  if (props.wonFlag === WON_FLAG_WON) {
    if (QuestionResult.isCorrect(lastResult)) {
      // we won because we answered correctly
      wonText = 'You answered the correct answer: ' + lastResult.answer
    } else {
      // we won because the opponent answered incorrectly
      wonText = `${props.opponentName} answered ${lastResult.answer}, the correct answer was ${Equation.getSolution(
        lastResult.question.equation,
      )}`
    }
  } else {
    // we lost, but why?...

    if (QuestionResult.isTimeout(lastResult)) {
      // lost because opponent answered correctly
      wonText = `${props.opponentName} answered the correct answer: ${lastResult.answer}`
    } else {
      // lost because we answered incorrectly
      wonText = `You answered ${lastResult.answer}, but the correct answer was ${Equation.getSolution(lastResult.question.equation)}`
    }
  }

  const renderScore = (scoreValue, didWin) => {
    const animateStyle = {
      position: 'absolute',
      top: isAnimatingScore
        ? scoreAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '-100%'],
          })
        : 0,
    }
    if (didWin && !isScoreUpdate) {
      return (
        <React.Fragment>
          <Animated.View style={animateStyle}>
            <TitleText style={styles.score}>{scoreValue - 1}</TitleText>
            <TitleText style={styles.score}>{scoreValue}</TitleText>
          </Animated.View>
          <TitleText style={[styles.score, {opacity: 0}]}>{scoreValue}</TitleText>
        </React.Fragment>
      )
    } else {
      return <TitleText style={styles.score}>{scoreValue}</TitleText>
    }
  }

  return (
    <View style={styles.window}>
      {!!isFadingOut && (
        <Animated.View
          style={[
            styles.waitingVeil,
            {
              backgroundColor: backgroundColor,
              opacity: isAnimatingFadeOut
                ? fadeOutAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0],
                  })
                : 1,
            },
          ]}
        />
      )}
      <TitleText>You {props.wonFlag === WON_FLAG_WON ? 'won!' : 'lost'}</TitleText>
      <NormalText>{wonText}</NormalText>

      <View style={styles.scoresContainer}>
        <View style={styles.singleScoreContainer}>
          <NormalText>{props.myName}</NormalText>
          <DividerLine />
          <View style={styles.scoreValueContainer}>{renderScore(props.myScore, props.wonFlag === WON_FLAG_WON)}</View>
          {amIReady ? (
            <Icon icon={Check} color={green} />
          ) : (
            <MenuButton title={'Play again'} onPressStart={handlePlayAgain} blurCount={2} />
          )}
        </View>
        <View style={styles.singleScoreContainer}>
          <NormalText>{props.opponentName}</NormalText>
          <DividerLine />
          <View style={styles.scoreValueContainer}>{renderScore(props.opponentScore, props.wonFlag === WON_FLAG_LOST)}</View>
          {isOpponentReady ? <Icon icon={Check} color={green} /> : <Icon icon={Question} color={grey} />}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  window: {...ScreenContainer},
  waitingVeil: {
    ...FullScreenOverlay,
    zIndex: 10,
  },
  scoresContainer: {
    marginTop: spaceExtraLarge,
    width: '100%',
    flexDirection: 'row',
  },
  singleScoreContainer: {
    flex: 1,
    alignItems: 'center',
  },

  scoreValueContainer: {
    marginBottom: spaceLarge,
    overflow: 'hidden',
  },

  score: {},
})

ResultsAndPlayAgain.propTypes = {
  socket: PropTypes.instanceOf(VersusSocket),
  myScore: PropTypes.number,
  opponentScore: PropTypes.number,
  myName: PropTypes.string,
  opponentName: PropTypes.string,
  wonFlag: PropTypes.number,
  onPlayAgain: PropTypes.func,
}

export default ResultsAndPlayAgain
