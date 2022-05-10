import React, {useState, useEffect} from 'react'
import {StyleSheet, View} from 'react-native'
import {FullScreenOverlay, ScreenContainer} from '../../styles/elements'
import CalculatorInput from '../../components/UI/CalculatorInput'
import {useDispatch, useSelector} from 'react-redux'
import {selectUserAnswer} from '../../redux/selectors'
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
import {recordAnswer} from '../../redux/GameSlice'
import {setAnswer} from '../../redux/UISlice'
import {ANSWER_TIMEOUT, OPPONENT_WRONG_ANSWER} from '../../constants/game'
import isDarkMode from '../../hooks/isDarkMode'

function VersusRound(props) {
  const [isWaiting, setIsWaiting] = useState(true)
  const userAnswer = useSelector(selectUserAnswer)
  const settings = useSelector(state => state.Game.settings)
  const [question, setQuestion] = useState(null)
  const isDark = isDarkMode()
  const dispatch = useDispatch()

  const handleQuestion = (q, timeout) => {
    setQuestion(q)
    setTimeout(() => {
      setIsWaiting(false)
    }, timeout)
  }

  const hostChooseQuestion = () => {
    const q = GameQuestion.getRandomFromSettings(settings)
    // wait up to 5 seconds to start
    const timeout = Math.ceil(Math.random() * 5000)
    const triggerTime = Date.now() + timeout

    // we call local function first so the timeout can be set as close to accurate
    handleQuestion(q, timeout)
    props.socket.broadcastNewQuestion(q, triggerTime)
  }

  const handleGuess = () => {
    props.socket.broadcastAnswer(userAnswer)
    let result = new QuestionResult(question, userAnswer)
    dispatch(recordAnswer(userAnswer))
    if (QuestionResult.isCorrect(result)) {
      props.onWon(userAnswer)
    } else {
      props.onLost(userAnswer)
    }
  }

  const handleOpponentGuess = oppAnswer => {
    let result = new QuestionResult(question, userAnswer)
    if (QuestionResult.isCorrect(result)) {
      dispatch(recordAnswer(ANSWER_TIMEOUT))
      props.onLost(ANSWER_TIMEOUT)
    } else {
      dispatch(recordAnswer(OPPONENT_WRONG_ANSWER))
      props.onWon(OPPONENT_WRONG_ANSWER)
    }
  }

  useEffect(() => {
    let questionListener
    if (props.isHost) {
      // TODO: possible race condition where the host moves to Versus and broadcasts the question before opponent
      //  can mount and listen for the question broadcast. May want to wrap that ChooseQuestion function in a timeout of its own?
      hostChooseQuestion()
    } else {
      questionListener = props.socket.on(EVENT_BroadcastNewQuestion, e => {
        // TODO: Event payloads
        handleQuestion(e.question, e.triggerTime - Date.now())
      })
    }
    const answerListener = props.socket.on(EVENT_SubmitAnswer, e => {
      handleOpponentGuess(e.answer)
    })

    // make sure the answer input is reset
    dispatch(setAnswer(''))

    return () => {
      if (questionListener) {
        props.socket.off(questionListener)
      }
      props.socket.off(answerListener)
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
