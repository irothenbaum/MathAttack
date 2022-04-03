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
import {WON_FLAG_LOST, WON_FLAG_WON} from '../constants/versus'

const STEP_joinOrHost = 'joinOrHost'
const STEP_waiting = 'waiting'
const STEP_versusRound = 'versusRound'
const STEP_results = 'results'

const STEPS = [STEP_joinOrHost, STEP_waiting, STEP_versusRound, STEP_results]

function GameVersus() {
  const socket = useRef(null)
  const [step, setStep] = useState(STEPS[0])
  const [connectCode, setConnectCode] = useState('')
  const [myName, setMyName] = useState('')
  const [opponentName, setOpponentName] = useState('')
  const [myScore, setMyScore] = useState(0)
  const [opponentScore, setOpponentScore] = useState(0)
  const [isHost, setIsHost] = useState(null)
  const [wonFlag, setWonFlag] = useState(0)

  // -----------------------------------------------------------------------------------------
  // HANDLERS

  const handleSocket = (s, host, code) => {
    socket.current = s
    setIsHost(host)
    setConnectCode(code)
    setStep(STEP_waiting)
  }

  const handleGameStart = (me, them) => {
    setMyName(me)
    setOpponentName(them)
    setStep(STEP_versusRound)
  }

  const handleWon = () => {
    setMyScore(myScore + 1)
    setWonFlag(WON_FLAG_WON)
  }

  const handleLost = () => {
    setOpponentScore(opponentScore + 1)
    setWonFlag(WON_FLAG_LOST)
  }

  const handlePlayAgain = () => {
    setWonFlag(0)
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
        <WaitingForOpponent
          isHost={isHost}
          code={connectCode}
          socket={socket.current}
          onStart={handleGameStart}
        />
      )
      break

    case STEP_versusRound:
      screen = (
        <VersusRound
          isHost={isHost}
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
          myName={myName}
          opponentName={opponentName}
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

/*
Event flow:

- host creates game
- opp joins game
  - broadcasts opponent joined event
- host/opponent readies
  - broadcasts ready event
- game starts
  - broadcast question w/ start timestamp
USER GUESSES:
  - broadcast guess
  if correct:
    - mark correct in games reducer
  if incorrect:
    - mark incorrect in gmae reducer
  Go to Results
OPP GUESSES:
  - receive guess
  if correct:
    - mark N/A in games reducer
  if incorrect:
    - mark correct with N/A in games reducer (HOW?)
  Go to results

 */
