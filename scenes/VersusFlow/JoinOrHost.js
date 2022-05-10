import React, {useState} from 'react'
import {View, StyleSheet} from 'react-native'
import TitleText from '../../components/TitleText'
import MenuButton from '../../components/MenuButton'
import StringInput from '../../components/StringInput'
import PropTypes from 'prop-types'
import DividerLine from '../../components/DividerLine'
import NormalText from '../../components/NormalText'
import {spaceDefault, spaceExtraLarge, spaceLarge} from '../../styles/layout'
import VersusSocket from '../../lib/VersusSocket'
import {Types} from 'websocket-client'

function JoinOrHost(props) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [joinCode, setJoinCode] = useState(null)

  const handleNewGame = () => {
    setIsConnecting(true)
    const socket = new VersusSocket()
    const handler = socket.on(Types.CONNECTION.WAITING, e => {
      props.onConnect(socket, true, e.connectCode)
      socket.off(handler)
    })
    socket.init().then()
  }

  const handleJoinGame = () => {
    setIsConnecting(true)
    const socket = new VersusSocket(joinCode)
    const handler = socket.on(Types.CONNECTION.READY, e => {
      props.onConnect(socket, false, joinCode)
      socket.off(handler)
    })
    socket.init(joinCode).then()
  }

  return (
    <View style={styles.container}>
      <TitleText style={styles.titleText}>Versus</TitleText>
      <NormalText style={styles.prompt}>Host a new game:</NormalText>
      <MenuButton
        isLoading={isConnecting}
        title={'New Game'}
        onPress={handleNewGame}
      />
      <DividerLine />
      <StringInput
        label={'Enter game code'}
        value={joinCode}
        onChange={setJoinCode}
      />
      <MenuButton
        isDisabled={!joinCode}
        isLoading={isConnecting}
        title={'Join Game'}
        onPress={handleJoinGame}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: spaceDefault,
    marginBottom: spaceExtraLarge,
  },
  titleText: {
    marginBottom: spaceLarge,
    textAlign: 'center',
  },
  prompt: {
    marginBottom: spaceDefault,
  },
})

JoinOrHost.propTypes = {
  onConnect: PropTypes.func.isRequired,
}

export default JoinOrHost
