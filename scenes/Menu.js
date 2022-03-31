import React, {useEffect} from 'react'
import {View, StyleSheet, Pressable} from 'react-native'
import TitleText from '../components/TitleText'
import MenuButton from '../components/MenuButton'
import {useDispatch, useSelector} from 'react-redux'
import {goToScene} from '../redux/NavigationSlice'
import {startNewGame as startNewClassicGame} from '../redux/GameSlice'
import {startNewGame as startNewMarathonGame} from '../redux/GameSlice'
import {startNewGame as startNewEstimateGame} from '../redux/GameSlice'
import {startNewGame as startNewVersusGame} from '../redux/GameSlice'
import {
  Scene_GameClassic,
  Scene_GameEstimate,
  Scene_GameMarathon,
  Scene_GameVersus,
  Scene_Settings,
} from '../constants/scenes'
import {selectGameSettings} from '../redux/selectors'
import {spaceDefault, spaceExtraLarge, spaceLarge} from '../styles/layout'
import {setCurrentGame} from '../redux/GlobalSlice'
import {
  faRunning,
  faHourglassHalf,
  faBullseye,
  faFistRaised,
} from '@fortawesome/free-solid-svg-icons'
import {setAnswer} from '../redux/UISlice'
import NormalText from '../components/NormalText'
import {font1, font3, font4} from '../styles/typography'
import {faCog} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {shadow, sunbeam} from '../styles/colors'
import isDarkMode from '../hooks/isDarkMode'
import {
  GAME_LABEL_CLASSIC,
  GAME_LABEL_ESTIMATE,
  GAME_LABEL_MARATHON,
  GAME_LABEL_VERSUS,
} from '../constants/game'
import {ScreenContainer} from '../styles/elements'

const pjson = require('../package.json')

function Menu() {
  const dispatch = useDispatch()
  const settings = useSelector(selectGameSettings)
  const isDark = isDarkMode()

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

  const handlePlayVersus = () => {
    dispatch(startNewVersusGame(settings))
    dispatch(setCurrentGame(Scene_GameVersus))
    dispatch(goToScene(Scene_GameVersus))
  }

  return (
    <View style={styles.window}>
      <TitleText style={styles.title}>Math, ATTACK!</TitleText>
      <View style={styles.gameButtonContainer}>
        <MenuButton
          size={MenuButton.SIZE_LARGE}
          title={GAME_LABEL_CLASSIC}
          onPress={handlePlayClassic}
          icon={faHourglassHalf}
        />
      </View>
      <View style={styles.gameButtonContainer}>
        <MenuButton
          size={MenuButton.SIZE_LARGE}
          title={GAME_LABEL_MARATHON}
          onPress={handlePlayMarathon}
          icon={faRunning}
        />
      </View>
      <View style={styles.gameButtonContainer}>
        <MenuButton
          size={MenuButton.SIZE_LARGE}
          title={GAME_LABEL_ESTIMATE}
          onPress={handlePlayEstimation}
          icon={faBullseye}
        />
      </View>
      <View style={styles.gameButtonContainer}>
        <MenuButton
          size={MenuButton.SIZE_LARGE}
          title={GAME_LABEL_VERSUS}
          onPress={handlePlayVersus}
          icon={faFistRaised}
        />
      </View>

      <View style={styles.footnoteContainer}>
        <NormalText style={styles.footnote}>v{pjson.version}</NormalText>
        <Pressable onPress={() => dispatch(goToScene(Scene_Settings))}>
          <FontAwesomeIcon
            size={font3}
            icon={faCog}
            color={isDark ? sunbeam : shadow}
          />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  window: {
    ...ScreenContainer,
    paddingBottom: 100,
  },

  title: {
    marginBottom: spaceLarge,
  },

  gameButtonContainer: {
    width: '100%',
    padding: spaceDefault,
  },

  footnoteContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spaceDefault,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  footnote: {
    opacity: 0.5,
    fontSize: font1,
  },
})

export default Menu
