import React, {useCallback} from 'react'
import {View, StyleSheet} from 'react-native'
import TitleText from '../components/TitleText'
import MenuButton from '../components/MenuButton'
import {useDispatch, useSelector} from 'react-redux'
import {goToScene} from '../redux/NavigationSlice'
import {startNewGame} from '../redux/GameClassicSlice'
import {Scene_GameClassic} from '../constants/scenes'
import {selectClassicGameSettings} from '../redux/selectors'

const styles = StyleSheet.create({
  window: {},
})

function Menu() {
  const dispatch = useDispatch()
  const settings = useSelector(selectClassicGameSettings)
  const handlePlay = () => {
    dispatch(startNewGame(settings))
    dispatch(goToScene(Scene_GameClassic))
  }

  return (
    <View style={styles.window}>
      <TitleText>Math, ATTACK!</TitleText>

      <MenuButton title={'Play'} onPress={handlePlay} />
    </View>
  )
}

export default Menu
