import React, {useEffect, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {FullScreenOverlay, ScreenContainer} from '../../styles/elements'
import TitleText from '../../components/TitleText'
import {black, neonGreen, dimmedGreen, white} from '../../styles/colors'
import VersusSocket from '../../lib/VersusSocket'
import PropTypes from 'prop-types'
import {EVENT_MarkReady, WON_FLAG_WON, OPPONENT_WRONG_ANSWER} from '../../constants/versus'
import NormalText from '../../components/NormalText'
import {useSelector} from 'react-redux'
import {selectLastGameResults} from '../../redux/selectors'
import QuestionResult from '../../models/QuestionResult'
import Equation from '../../models/Equation'
import MenuButton from '../../components/MenuButton'
import DividerLine from '../../components/DividerLine'
import {font3} from '../../styles/typography'
import {faCheck} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import isDarkMode from '../../hooks/isDarkMode'
import useAnimationStation from '../../hooks/useAnimationStation'

const FADE_REVEAL = 1000

function ResultsAndPlayAgain(props) {
  const [isFadingOut, setIsFadingOut] = useState(true)
  const [isOpponentReady, setIsOpponentReady] = useState(false)
  const [amIReady, setAmIReady] = useState(false)
  const isDark = isDarkMode()
  const {animate, animation} = useAnimationStation()

  const results = useSelector(selectLastGameResults)
  const lastResult = results[results.length - 1]

  const handlePlayAgain = () => {
    props.socket.broadcastReady()
    setAmIReady(true)
  }

  useEffect(() => {
    animate(FADE_REVEAL, () => setIsFadingOut(false))

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

  let wonText
  if (QuestionResult.isCorrect(lastResult)) {
    if (props.wonFlag === WON_FLAG_WON) {
      wonText = 'You answered the correct answer: ' + lastResult.answer
    } else {
      wonText = `${props.opponentName} answered the correct answer: ${lastResult.answer}`
    }
  } else if (props.wonFlag === WON_FLAG_WON) {
    wonText = `${props.opponentName} answered ${
      lastResult.answer === OPPONENT_WRONG_ANSWER ? 'incorrectly, ' : `${lastResult.answer}, but`
    } the correct answer was ${Equation.getSolution(
      lastResult.question.equation,
    )}`
  } else {
    wonText = `You answered ${
      lastResult.answer
    }, but the correct answer was ${Equation.getSolution(
      lastResult.question.equation,
    )}`
  }

  // TODO: I want to animate the point being added somehow
  const myScore = props.myScore
  const opponentScore = props.opponentScore

  return (
    <View style={styles.window}>
      {isFadingOut && (
        <View
          style={{
            ...styles.waitingVeil,
            backgroundColor: isDark ? black : white,
            opacity: animation ? animation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }) : 1,
          }}
        />
      )}
      <TitleText>
        You {props.wonFlag === WON_FLAG_WON ? 'Won' : 'Lost'}
      </TitleText>
      <NormalText>{wonText}</NormalText>

      <View style={styles.scoresContainer}>
        <View style={styles.singleScoreContainer}>
          <NormalText>{props.myName}</NormalText>
          <DividerLine />
          <TitleText>{myScore}</TitleText>
          {amIReady ? (
            <FontAwesomeIcon
              size={font3}
              icon={faCheck}
              color={isDark ? dimmedGreen : neonGreen}
            />
          ) : (
            <MenuButton title={'Play again?'} onPress={handlePlayAgain} />
          )}
        </View>
        <View style={styles.singleScoreContainer}>
          <NormalText>{props.opponentName}</NormalText>
          <DividerLine />
          <TitleText>{opponentScore}</TitleText>
          {isOpponentReady && (
            <FontAwesomeIcon
              size={font3}
              icon={faCheck}
              color={isDark ? dimmedGreen : neonGreen}
            />
          )}
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
    backgroundColor: white,
  },
  scoresContainer: {
    flexDirection: 'row',
  },
  singleScoreContainer: {},
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
