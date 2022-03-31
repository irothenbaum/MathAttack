import React, {useState, useRef, useEffect, useCallback} from 'react'
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import TitleText from '../components/TitleText'
import InGameMenu from '../components/InGameMenu'
import MenuButton from '../components/MenuButton'
import NumberInput from '../components/NumberInput'
import {ScreenContainer} from '../styles/elements'
import JoinOrHost from './VersusFlow/JoinOrHost'
import WaitingForOpponent from './VersusFlow/WaitingForOpponent'
import VersusRound from './VersusFlow/VersusRound'
import ResultsAndPlayAgain from './VersusFlow/ResultsAndPlayAgain'

const STEP_joinOrHost = 'joinOrHost'
const STEP_waiting = 'waiting'
const STEP_versusRound = 'versusRound'
const STEP_results = 'results'

const STEPS = [STEP_joinOrHost, STEP_waiting, STEP_versusRound, STEP_results]

function GameVersus() {
  const socket = useRef(null)
  const [step, setStep] = useState(STEPS[0])
  const [myName, setMyName] = useState('')
  const [opponentName, setOpponentName] = useState('')
  const [myScore, setMyScore] = useState(0)
  const [opponentScore, setOpponentScore] = useState(0)
  const [isHost, setIsHost] = useState(null)
  const [wonFlag, setWonFlag] = useState(0)

  // -----------------------------------------------------------------------------------------
  // HANDLERS

  const handleSocket = (s, name, host) => {
    socket.current = s
    setIsHost(host)
    setMyName(name)
    setStep(STEP_waiting)
  }

  const handleGameStart = (me, them) => {
    setMyName(me)
    setOpponentName(them)
    setStep(STEP_versusRound)
  }

  const handleWon = () => {
    setMyScore(myScore + 1)
    setWonFlag(1)
  }

  const handleLost = () => {
    setOpponentScore(opponentScore + 1)
    setWonFlag(-1)
  }

  const handlePlayAgain = () => {
    setWonFlag(null)
    setStep(STEP_versusRound)
  }

  // -----------------------------------------------------------------------------------------
  // EFFECTS:
  useEffect(() => {}, [])

  // -----------------------------------------------------------------------------------------
  // SCREENS:

  let screen
  switch (step) {
    case STEP_joinOrHost:
      screen = <JoinOrHost onConnect={handleSocket} />
      break

    case STEP_waiting:
      screen = (
        <WaitingForOpponent socket={socket.current} onStart={handleGameStart} />
      )
      break

    case STEP_versusRound:
      screen = (
        <VersusRound
          socket={socket.current}
          onWon={handleWon}
          onLost={handleLost}
        />
      )
      break

    case STEP_results:
      screen = (
        <ResultsAndPlayAgain
          socket={socket.current}
          myScore={myScore}
          opponentScore={opponentScore}
          wonFlag={wonFlag}
          onPlayAgain={handlePlayAgain}
        />
      )
      break

    default:
      throw new Error(`Unrecognized Versus step "${step}"`)
  }

  return (
    <View style={styles.window}>
      <InGameMenu />
      {screen}
    </View>
  )
}

const styles = StyleSheet.create({
  window: {...ScreenContainer},
})

export default GameVersus
