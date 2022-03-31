import React, {useState, useEffect} from 'react'
import {StyleSheet, View} from 'react-native'
import {FullScreenOverlay, ScreenContainer} from '../../styles/elements'
import CalculatorInput from '../../components/UI/CalculatorInput'
import {useSelector} from 'react-redux'
import {selectUserAnswer} from '../../redux/selectors'
import GameQuestion from '../../models/GameQuestion'
import VersusSocket from '../../models/VersusSocket'
import PropTypes from 'prop-types'
import {neonBlue} from '../../styles/colors'
import EquationAndAnswerInterface from '../../components/UI/EquationAndAnswerInterface'

function VersusRound(props) {
  const [isWaiting, setIsWaiting] = useState(true)
  const userAnswer = useSelector(selectUserAnswer)
  const settings = useSelector(state => state.Game.settings)
  const [question, setQuestion] = useState(null)

  const chooseQuestion = () => {
    const q = GameQuestion.getRandomFromSettings(settings)
    setQuestion(q)
    const timeout = Math.random() * 5000
    props.socket.broadcastNewQuestion(q, Date.now() + timeout)
    setTimeout(() => {
      setIsWaiting(false)
    }, timeout)
  }

  const handleGuess = () => {
    props.socket.broadcastAnswer(userAnswer)
  }

  useEffect(() => {
    chooseQuestion()
    // TODO: We need to listen for our opponent finishing first
    const listener = props.socket.on()
    return () => {
      props.socket.off(listener)
    }
  }, [])

  return (
    <View style={styles.window}>
      {isWaiting && <View style={styles.waitingVeil} />}

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
}

export default VersusRound
