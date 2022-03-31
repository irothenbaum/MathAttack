import React, {useState, useRef, useEffect, useCallback} from 'react'
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import TitleText from '../../components/TitleText'
import InGameMenu from '../../components/InGameMenu'
import MenuButton from '../../components/MenuButton'
import StringInput from '../../components/StringInput'
import PropTypes from 'prop-types'
import DividerLine from '../../components/DividerLine'

function JoinOrHost(props) {
  const [joinCode, setJoinCode] = useState(null)
  const [name, setName] = useState(null)

  const handleNewGame = () => {
    const socket = null
    props.onConnect(socket, name, true)
  }

  const handleJoinGame = () => {
    const socket = null
    props.onConnect(socket, name, false)
  }

  return (
    <View style={styles.window}>
      <InGameMenu />
      <TitleText>Versus</TitleText>
      <StringInput label={'Enter your name'} value={name} onChange={setName} />
      <View>
        <MenuButton title={'New Game'} onPress={handleNewGame} />
        <DividerLine />
        <View>
          <StringInput value={joinCode} onChange={setJoinCode} />
          <MenuButton title={'Join Game'} onPress={handleJoinGame} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  window: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

JoinOrHost.propTypes = {
  onConnect: PropTypes.func.isRequired,
}

export default JoinOrHost
