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

// 5 seconds
const STARTING_TIMEOUT = 5

function WaitingForOpponent(props) {
  const [hasReadied, setHasReadied] = useState(false)
  const [hasOpponentReadied, setHasOpponentReadied] = useState(true)
  const [name, setName] = useState('')
  const {secondsRemaining, startCountdown} = useCountdown(
    STARTING_TIMEOUT,
    props.onStart,
  )

  const handleReady = () => {
    props.socket.markReady()
    setHasReadied(true)
  }

  useEffect(() => {
    if (hasReadied && hasOpponentReadied) {
      console.log('STARTED!')
      startCountdown()
    }
  }, [hasReadied, hasOpponentReadied])

  useEffect(() => {
    // TODO: When the other user connects, we want to store their name
    const listener = props.socket.on('', () => {
      setHasOpponentReadied(true)
    })
    return () => {
      props.socket.off(listener)
    }
  }, [])

  return (
    <View style={styles.container}>
      <NormalText>
        You and your opponent will be shown the same question. First one to
        answer correctly wins. If you answer incorrectly, you lose.
      </NormalText>

      <DividerLine />

      {hasReadied ? (
        hasOpponentReadied ? (
          <React.Fragment>
            <NormalText>Game starts in</NormalText>
            <TitleText>{secondsRemaining}</TitleText>
          </React.Fragment>
        ) : (
          <UIText>Waiting for opponent</UIText>
        )
      ) : (
        <React.Fragment>
          <NormalText>Enter your name and click Ready when ready.</NormalText>
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
}

export default WaitingForOpponent
