import React, {useRef, useState, useEffect} from 'react'
import {StyleSheet, View} from 'react-native'
import {FullScreenOverlay, ScreenContainer} from '../../styles/elements'
import CalculatorInput from '../../components/UI/CalculatorInput'
import {useDispatch, useSelector} from 'react-redux'
import {selectCurrentQuestion, selectUserAnswer} from '../../redux/selectors'
import GameQuestion from '../../models/GameQuestion'
import VersusSocket from '../../lib/VersusSocket'
import PropTypes from 'prop-types'
import {neonBlue, dimmedBlue} from '../../styles/colors'
import EquationAndAnswerInterface from '../../components/UI/EquationAndAnswerInterface'
import {
  EVENT_BroadcastNewQuestion,
  EVENT_SubmitAnswer,
} from '../../constants/versus'
import QuestionResult from '../../models/QuestionResult'
import {recordAnswer, setCurrentQuestion} from '../../redux/GameSlice'
import {setAnswer} from '../../redux/UISlice'
import {ANSWER_TIMEOUT} from '../../constants/game'
import {OPPONENT_WRONG_ANSWER} from '../../constants/versus'
import isDarkMode from '../../hooks/isDarkMode'

function VersusRound(props) {
  const questionListener = useRef()
  const answerListener = useRef()
  const [isWaiting, setIsWaiting] = useState(true)
  const userAnswer = useSelector(selectUserAnswer)
  const settings = useSelector(state => state.Game.settings)
  const question = useSelector(selectCurrentQuestion)

  const isDark = isDarkMode()
  const dispatch = useDispatch()

  const handleQuestion = (q, timeout) => {
    console.log(`${props.isHost ? 'host' : 'opp'} handling question with timeout ${timeout}`, q)
    dispatch(setCurrentQuestion(q))
    setTimeout(() => {
      setIsWaiting(false)
    }, timeout)

    // start listening for opponent answers
    answerListener.current = props.socket.on(EVENT_SubmitAnswer, e => {
      let result = new QuestionResult(q, e.answer)
      if (QuestionResult.isCorrect(result)) {
        dispatch(recordAnswer(ANSWER_TIMEOUT))
        props.onLost(ANSWER_TIMEOUT)
      } else {
        dispatch(recordAnswer(OPPONENT_WRONG_ANSWER))
        props.onWon(OPPONENT_WRONG_ANSWER)
      }
    })
  }

  const hostChooseQuestion = () => {
    const q = GameQuestion.getRandomFromSettings(settings)
    // wait up to 5 seconds to start
    const timeout = Math.ceil(Math.random() * 5000) + 1000 // sometime between 1 second and 6 seconds
    const triggerTime = Date.now() + timeout

    // we call local function first so the timeout can be set as close to accurate
    handleQuestion(q, timeout)
    props.socket.broadcastNewQuestion(q, triggerTime)
  }

  const handleGuess = () => {
    console.log('GUESSED ' + userAnswer)
    props.socket.broadcastAnswer(userAnswer)
    let result = new QuestionResult(question, userAnswer)
    dispatch(recordAnswer(userAnswer))
    if (QuestionResult.isCorrect(result)) {
      props.onWon(userAnswer)
    } else {
      props.onLost(userAnswer)
    }
  }

  useEffect(() => {
    if (props.isHost) {
      // Possible race condition where the host moves to Versus and broadcasts the question before opponent
      //  can mount and listen for the question broadcast. So we add an extra 1 second wait to be safe
      setTimeout(() => {
        hostChooseQuestion()
      }, 1000)
    } else {
      questionListener.current = props.socket.on(EVENT_BroadcastNewQuestion, e => {
        handleQuestion(e.question, e.startTimestamp - Date.now())
      })
    }

    // make sure the answer input is reset
    dispatch(setAnswer(''))

    return () => {
      if (questionListener.current) {
        props.socket.off(questionListener.current)
      }
      props.socket.off(answerListener.current)
    }
  }, [])

  return (
    <View style={styles.window}>
      {isWaiting && (
        <View
          style={{
            ...styles.waitingVeil,
            backgroundColor: isDark ? dimmedBlue : neonBlue,
          }}
        />
      )}

      <EquationAndAnswerInterface onGuess={handleGuess} />

      <View style={styles.calculatorContainer}>
        <CalculatorInput />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  window: {...ScreenContainer},
  waitingVeil: {
    ...FullScreenOverlay,
    zIndex: 10,
    backgroundColor: neonBlue,
  },
  calculatorContainer: {
    flex: 1,
  },
})

VersusRound.propTypes = {
  socket: PropTypes.instanceOf(VersusSocket),
  isHost: PropTypes.bool,
  onWon: PropTypes.func,
  onLost: PropTypes.func,
}

export default VersusRound
