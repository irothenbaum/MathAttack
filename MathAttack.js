import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import {selectCurrentScene} from './redux/selectors'
import {
  Scene_GameClassic,
  Scene_GameEstimate,
  Scene_GameMarathon,
  Scene_GameResults,
  Scene_GameVersus,
  Scene_Menu,
  Scene_Settings,
} from './constants/scenes'
import GameClassic from './scenes/GameClassic'
import Menu from './scenes/Menu'
import Settings from './scenes/Settings'
import GameResults from './scenes/GameResults'
import GameMarathon from './scenes/GameMarathon'
import GameEstimate from './scenes/GameEstimate'
import useAnimationStation from './hooks/useAnimationStation'
import GameVersus from './scenes/GameVersus'
import {StyleSheet, Animated, View, Dimensions} from 'react-native'
import useReduxPersist from './hooks/useReduxPersist'
import {SCENE_CHANGE_TRANSITION_DURATION} from './constants/game'
import isDarkMode from './hooks/isDarkMode'
import {getBackgroundColor} from './lib/utilities'

const SceneMap = {
  [Scene_Menu]: Menu,
  [Scene_Settings]: Settings,
  [Scene_GameClassic]: GameClassic,
  [Scene_GameMarathon]: GameMarathon,
  [Scene_GameResults]: GameResults,
  [Scene_GameEstimate]: GameEstimate,
  [Scene_GameVersus]: GameVersus,
}

// we want our transition flash to be a square so we scale the width by a percentage relative to the height
const {width, height} = Dimensions.get('window')
const ratio = height / width
const percent = `${parseInt(100 * ratio)}%`

function MathAttack() {
  const currentScene = useSelector(selectCurrentScene)
  const isTransitioningToScene = useSelector((state) => state.Navigation.isTransitioningToScene)
  const {animate: animateScreenChange, animation: screenChangeAnimation, isAnimating: isChangingScreens} = useAnimationStation()
  const isDark = isDarkMode()

  const {flush, hydrate} = useReduxPersist()

  useEffect(() => {
    hydrate()
  }, [])

  useEffect(() => {
    if (isTransitioningToScene) {
      animateScreenChange(SCENE_CHANGE_TRANSITION_DURATION * 2)
    }
  }, [isTransitioningToScene])

  // whenever the scene changes, we save our settings
  useEffect(() => {
    flush()
  }, [currentScene])

  let SceneComponent = SceneMap[currentScene]

  if (!SceneComponent) {
    throw new Error(`Scene missing "${currentScene}"`)
  }

  return (
    <View style={styles.sceneWrapper}>
      {isChangingScreens && (
        <View style={styles.sceneTransitionContainer}>
          <Animated.View
            style={{
              backgroundColor: getBackgroundColor(isDark),
              height: screenChangeAnimation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: ['0%', '100%', '0%'],
              }),
              width: screenChangeAnimation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: ['0%', percent, '0%'],
              }),
            }}
          />
        </View>
      )}
      <SceneComponent />
    </View>
  )
}

const styles = StyleSheet.create({
  sceneWrapper: {
    height: '100%',
    width: '100%',
  },

  sceneTransitionContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default MathAttack
