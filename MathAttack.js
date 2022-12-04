import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {selectCurrentScene, selectGameSettings} from './redux/selectors'
import {
  Scene_GameClassic,
  Scene_GameCrescendo,
  Scene_GameDailyChallenge,
  Scene_GameEstimate,
  Scene_GameFractions,
  Scene_GameMarathon,
  Scene_GameResults,
  Scene_GameVersus,
  Scene_HighScores,
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
import HighScores from './scenes/HighScores'
import useColorsControl from './hooks/useColorsControl'
import LoadingSplash from './components/LoadingSplash'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {scheduleReminders} from './lib/dailyChallenge'
import GameDailyChallenge from './scenes/GameDailyChallenge'
import GameFractions from './scenes/GameFractions'
import NotificationHelper from './lib/NotificationHelper'

const SceneMap = {
  [Scene_Menu]: Menu,
  [Scene_Settings]: Settings,
  [Scene_GameClassic]: GameClassic,
  [Scene_GameMarathon]: GameMarathon,
  [Scene_GameResults]: GameResults,
  [Scene_GameEstimate]: GameEstimate,
  [Scene_GameCrescendo]: GameCrescendo,
  [Scene_GameVersus]: GameVersus,
  [Scene_GameDailyChallenge]: GameDailyChallenge,
  [Scene_GameFractions]: GameFractions,
  [Scene_HighScores]: HighScores,
}

function MathAttack() {
  const [isReady, setIsReady] = useState(false)
  const currentScene = useSelector(selectCurrentScene)
  const isTransitioningToScene = useSelector((state) => state.Navigation.isTransitioningToScene)
  const {animate: animateScreenChange, animation: screenChangeAnimation, isAnimating: isChangingScreens} = useAnimationStation()
  const isDark = useDarkMode()
  const {background} = useColorsControl()
  const gameSettings = useSelector(selectGameSettings)

  const insets = useSafeAreaInsets()
  useEffect(() => {
    // this is a little hacky, but whatever
    global._SafeAreaInsets = {top: insets.top, bottom: insets.bottom}
  }, [insets.top, insets.bottom])

  const {flush, hydrate} = useReduxPersist()

  useEffect(() => {
    hydrate()
      .then(() => NotificationHelper.Instance().handleInitialNotification())
      .then(() => setIsReady(true))
  }, [])

  useEffect(() => {
    if (isTransitioningToScene) {
      animateScreenChange(SCENE_CHANGE_TRANSITION_DURATION * 2)
    }
  }, [isTransitioningToScene])

  // whenever the scene changes back to Menu, we save our persistent data
  useEffect(() => {
    if (!isReady || currentScene !== Scene_Menu) {
      return
    }
    flush().then()
  }, [currentScene, isReady])

  useEffect(() => {
    if (!isReady) {
      return
    }

    if (typeof gameSettings.minValue === 'number' && typeof gameSettings.maxValue === 'number') {
      // whenever our gameSettings change, we reschedule our reminders
      scheduleReminders(gameSettings)
    }
  }, [isReady, gameSettings])

  let SceneComponent = isReady ? SceneMap[currentScene] : LoadingSplash

  if (!SceneComponent) {
    console.error(new Error(`Scene missing "${currentScene}"`))
    SceneComponent = LoadingSplash
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
