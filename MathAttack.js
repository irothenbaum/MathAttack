import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
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
import {AsyncStorage} from 'react-native'
import useReduxPersist from './hooks/useReduxPersist'

const SceneMap = {
  [Scene_Menu]: Menu,
  [Scene_Settings]: Settings,
  [Scene_GameClassic]: GameClassic,
  [Scene_GameMarathon]: GameMarathon,
  [Scene_GameResults]: GameResults,
  [Scene_GameEstimate]: GameEstimate,
  [Scene_GameVersus]: GameVersus,
}

function MathAttack() {
  const currentScene = useSelector(selectCurrentScene)
  const {} = useAnimationStation()

  const {flush, hydrate} = useReduxPersist()

  useEffect(() => {
    hydrate()
  }, [])

  // whenever the scene changes
  useEffect(() => {
    flush()
  }, [currentScene])

  let SceneComponent = SceneMap[currentScene]

  if (!SceneComponent) {
    throw new Error(`Scene missing "${currentScene}"`)
  }

  return <SceneComponent />
}

export default MathAttack
