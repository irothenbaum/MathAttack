import React, {useState} from 'react'
import {View} from 'react-native'
import UIText from '../../components/UIText'
import NormalText from '../../components/NormalText'
import MenuButton from '../../components/MenuButton'

function WaitingForOpponent(props) {
  const [hasReadied, setHasReadied] = useState(false)

  const handleReady = () => {
    props.socket.markReady()
    setHasReadied(true)
  }

  return (
    <View>
      <NormalText>
        You and your opponent will be shown the same question. First one to
        answer correctly wins. If you answer incorrectly, you lose.
      </NormalText>

      {hasReadied ? (
        <UIText>Waiting for opponent</UIText>
      ) : (
        <MenuButton title={'Click when ready'} onPress={handleReady} />
      )}
    </View>
  )
}

export default WaitingForOpponent
