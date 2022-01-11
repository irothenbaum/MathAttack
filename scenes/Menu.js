import React, {useEffect} from 'react'
import {View, StyleSheet} from 'react-native'
import TitleText from '../components/TitleText'
import MenuButton from '../components/MenuButton'
import {useDispatch, useSelector} from 'react-redux'
import {goToScene} from '../redux/NavigationSlice'
import {startNewGame as startNewClassicGame} from '../redux/GameSlice'
import {startNewGame as startNewMarathonGame} from '../redux/GameSlice'
import {startNewGame as startNewEstimateGame} from '../redux/GameSlice'
import {
  Scene_GameClassic,
  Scene_GameEstimate,
  Scene_GameMarathon,
} from '../constants/scenes'
import {selectGameSettings} from '../redux/selectors'
import {spaceDefault, spaceExtraLarge} from '../styles/layout'
import {setCurrentGame} from '../redux/GlobalSlice'

import {
  faRunning,
  faHourglassHalf,
  faBullseye,
} from '@fortawesome/free-solid-svg-icons'
import {setAnswer} from '../redux/UISlice'

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
    width: '100%',
    padding: spaceDefault,
  },
})

function Menu() {
  const dispatch = useDispatch()
  const settings = useSelector(selectGameSettings)

  useEffect(() => {
    dispatch(setAnswer(''))
    return () => {}
  }, [])

  const handlePlayClassic = () => {
    dispatch(startNewClassicGame(settings))
    dispatch(setCurrentGame(Scene_GameClassic))
    dispatch(goToScene(Scene_GameClassic))
  }

  const handlePlayMarathon = () => {
    dispatch(startNewMarathonGame(settings))
    dispatch(setCurrentGame(Scene_GameMarathon))
    dispatch(goToScene(Scene_GameMarathon))
  }

  const handlePlayEstimation = () => {
    dispatch(startNewEstimateGame(settings))
    dispatch(setCurrentGame(Scene_GameEstimate))
    dispatch(goToScene(Scene_GameEstimate))
  }

  return (
    <View style={styles.window}>
      <TitleText style={styles.title}>Math, ATTACK!</TitleText>
      <View style={styles.gameButtonContainer}>
        <MenuButton
          size={MenuButton.SIZE_LARGE}
          title={'Classic'}
          onPress={handlePlayClassic}
          icon={faHourglassHalf}
        />
      </View>
      <View style={styles.gameButtonContainer}>
        <MenuButton
          size={MenuButton.SIZE_LARGE}
          title={'Marathon'}
          onPress={handlePlayMarathon}
          icon={faRunning}
        />
      </View>
      <View style={styles.gameButtonContainer}>
        <MenuButton
          size={MenuButton.SIZE_LARGE}
          title={'Estimation'}
          onPress={handlePlayEstimation}
          icon={faBullseye}
        />
      </View>
      <View style={{marginTop: 200}} />
    </View>
  )
}

export default Menu
