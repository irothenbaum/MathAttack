import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import {selectCurrentScene} from './redux/selectors'
import {
  Scene_GameClassic,
  Scene_GameCrescendo,
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
import {StyleSheet, Animated, View} from 'react-native'
import useReduxPersist from './hooks/useReduxPersist'
import {SCENE_CHANGE_TRANSITION_DURATION} from './constants/game'
import useDarkMode from './hooks/useDarkMode'
import GameCrescendo from './scenes/GameCrescendo'
import useColorsControl from './hooks/useColorsControl'

const SceneMap = {
  [Scene_Menu]: Menu,
  [Scene_Settings]: Settings,
  [Scene_GameClassic]: GameClassic,
  [Scene_GameMarathon]: GameMarathon,
  [Scene_GameResults]: GameResults,
  [Scene_GameEstimate]: GameEstimate,
  [Scene_GameCrescendo]: GameCrescendo,
  [Scene_GameVersus]: GameVersus,
}

function MathAttack() {
  const currentScene = useSelector(selectCurrentScene)
  const isTransitioningToScene = useSelector((state) => state.Navigation.isTransitioningToScene)
  const {animate: animateScreenChange, animation: screenChangeAnimation, isAnimating: isChangingScreens} = useAnimationStation()
  const isDark = useDarkMode()
  const {background} = useColorsControl()

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
    <View style={[styles.sceneWrapper, {backgroundColor: background}]}>
      {isChangingScreens && (
        <Animated.View
          style={[
            styles.sceneTransitionContainer,
            {
              width: '100%',
              height: '100%',
              backgroundColor: screenChangeAnimation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: isDark
                  ? ['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0)']
                  : ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0)'],
              }),
            },
          ]}
        >
          <Animated.View
            style={{
              width: '100%',
              backgroundColor: background,
              height: screenChangeAnimation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: ['0%', '50%', '0%'],
              }),
            }}
          />
          <Animated.View
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              height: screenChangeAnimation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: ['0%', '0%', '100%'],
              }),
            }}
          />
          <Animated.View
            style={{
              width: '100%',
              backgroundColor: background,
              height: screenChangeAnimation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: ['0%', '50%', '0%'],
              }),
            }}
          />
        </Animated.View>
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
