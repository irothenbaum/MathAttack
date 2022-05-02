import React, {useEffect, useState} from 'react'
import {View, StyleSheet} from 'react-native'
import UIText from '../../components/UIText'
import NormalText from '../../components/NormalText'
import MenuButton from '../../components/MenuButton'
import StringInput from '../../components/StringInput'
import DividerLine from '../../components/DividerLine'
import {spaceDefault} from '../../styles/layout'
import VersusSocket from '../../models/VersusSocket'
import PropTypes from 'prop-types'
import useCountdown from '../../hooks/useCountdown'
import TitleText from '../../components/TitleText'
import {EVENT_MarkReady} from '../../constants/versus'
import {Types} from '../../lib/websocket-client'

// 5 seconds
const STARTING_TIMEOUT = 5

function WaitingForOpponent(props) {
  const [hasReadied, setHasReadied] = useState(false)
  const [hasOpponentJoined, setHasOpponentJoined] = useState(false)
  const [hasOpponentReadied, setHasOpponentReadied] = useState(true)
  const [name, setName] = useState('')
  const [opponentName, setOpponentName] = useState('')
  const {secondsRemaining, startCountdown} = useCountdown(
    STARTING_TIMEOUT,
    () => {
      // when the countdown ends, we report both names
      props.onStart(name, opponentName)
    },
  )

  const handleReady = () => {
    props.socket.broadcastReady()
    setHasReadied(true)
  }

  useEffect(() => {
    if (hasReadied && hasOpponentReadied) {
      startCountdown()
    }
  }, [hasReadied, hasOpponentReadied])

  useEffect(() => {
    let joinListener
    console.log('MOUNTED', props.isHost)
    // if we're the host, we need to listen for the other play to join
    if (props.isHost) {
      joinListener = props.socket.on(Types.CONNECTION.READY, () => {
        console.log('OPPONENT JOINED')
        setHasOpponentJoined(true)
      })
    } else {
      // if we're the opponent, the host is already joined
      setHasOpponentJoined(true)
    }
    // listen for when the other player marks ready and store their name
    const readyListener = props.socket.on(EVENT_MarkReady, e => {
      setHasOpponentReadied(true)
      setOpponentName(e.name)
    })
    return () => {
      if (joinListener) {
        props.socket.off(joinListener)
      }
      props.socket.off(readyListener)
    }
  }, [])

  return (
    <View style={styles.container}>
      <TitleText>How to play:</TitleText>
      <NormalText>
        You and your opponent will be shown the same question. First one to
        answer correctly wins. If you answer incorrectly, you lose.
      </NormalText>

      <DividerLine />

      {!hasOpponentJoined ? (
        <React.Fragment>
          <NormalText>
            Share this code with your opponent so they can join your game.
          </NormalText>
          <TitleText>{props.code}</TitleText>
        </React.Fragment>
      ) : hasReadied ? (
        hasOpponentReadied ? (
          <React.Fragment>
            <NormalText>Game starts in</NormalText>
            <TitleText>{secondsRemaining}</TitleText>
          </React.Fragment>
        ) : (
          <UIText>Waiting for opponent to ready</UIText>
        )
      ) : (
        <React.Fragment>
          <NormalText>
            Players connected. Enter your name and click Ready when ready.
          </NormalText>
          <StringInput label={'name'} value={name} onChange={setName} />
          <MenuButton
            isDisabled={!name}
            title={'Ready'}
            onPress={handleReady}
          />
        </React.Fragment>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spaceDefault,
  },
})

WaitingForOpponent.propTypes = {
  socket: PropTypes.instanceOf(VersusSocket).isRequired,
  onStart: PropTypes.func.isRequired,
  code: PropTypes.string.isRequired,
  isHost: PropTypes.bool,
}

export default WaitingForOpponent
