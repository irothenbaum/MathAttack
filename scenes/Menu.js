import React from 'react'
import {View, StyleSheet} from 'react-native'
import TitleText from '../components/TitleText'
import MenuButton from '../components/MenuButton'
import {useDispatch, useSelector} from 'react-redux'
import {goToScene} from '../redux/NavigationSlice'
import {startNewGame} from '../redux/GameClassicSlice'
import {Scene_GameClassic, Scene_GameResults} from '../constants/scenes'
import {selectClassicGameSettings} from '../redux/selectors'
import {spaceDefault, spaceExtraLarge} from '../styles/layout'
import {setCurrentGame} from '../redux/GlobalSlice'

const styles = StyleSheet.create({
  window: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    marginBottom: spaceExtraLarge,
  },

  gameButtonContainer: {
    marginBottom: spaceDefault,
  },
})

function Menu() {
  const dispatch = useDispatch()
  const settings = useSelector(selectClassicGameSettings)
  const handlePlay = () => {
    dispatch(startNewGame(settings))
    dispatch(setCurrentGame(Scene_GameClassic))
    dispatch(goToScene(Scene_GameClassic))
  }

  return (
    <View style={styles.window}>
      <TitleText style={styles.title}>Math, ATTACK!</TitleText>
      <View style={styles.gameButtonContainer}>
        <MenuButton
          size={MenuButton.SIZE_LARGE}
          title={'Play'}
          onPress={handlePlay}
        />
      </View>
      <View style={styles.gameButtonContainer}></View>
      <View style={{marginTop: 200}} />
    </View>
  )
}

export default Menu
