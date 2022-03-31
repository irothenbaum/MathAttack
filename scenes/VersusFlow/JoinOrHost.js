import React, {useState, useRef, useEffect, useCallback} from 'react'
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import TitleText from '../../components/TitleText'
import InGameMenu from '../../components/InGameMenu'
import MenuButton from '../../components/MenuButton'
import StringInput from '../../components/StringInput'
import PropTypes from 'prop-types'
import DividerLine from '../../components/DividerLine'
import NormalText from '../../components/NormalText'
import {spaceDefault, spaceExtraLarge} from '../../styles/layout'
import VersusSocket from '../../models/VersusSocket'

function JoinOrHost(props) {
  const [joinCode, setJoinCode] = useState(null)
  const [name, setName] = useState(null)

  const handleNewGame = () => {
    const socket = new VersusSocket()
    props.onConnect(socket, name, true)
  }

  const handleJoinGame = () => {
    const socket = new VersusSocket(joinCode)
    props.onConnect(socket, name, false)
  }

  return (
    <View style={styles.container}>
      <TitleText style={styles.titleText}>Versus</TitleText>
      <NormalText style={styles.prompt}>Host a new game:</NormalText>
      <MenuButton title={'New Game'} onPress={handleNewGame} />
      <DividerLine />
      <StringInput
        label={'Enter game code'}
        value={joinCode}
        onChange={setJoinCode}
      />
      <MenuButton
        isDisabled={!joinCode}
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
  },
  titleText: {
    marginBottom: spaceExtraLarge,
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
