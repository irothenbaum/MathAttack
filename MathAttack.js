import React from 'react'
import {useSelector} from 'react-redux'
import {View} from 'react-native'
import {selectCurrentScene} from './redux/selectors'
import {
  Scene_GameClassic,
  Scene_GameEstimate,
  Scene_GameMarathon,
  Scene_GameResults,
  Scene_Menu,
  Scene_Settings,
} from './constants/scenes'
import GameClassic from './scenes/GameClassic'
import Menu from './scenes/Menu'
import Settings from './scenes/Settings'
import GameResults from './scenes/GameResults'
import GameMarathon from './scenes/GameMarathon'
import GameEstimate from './scenes/GameEstimate'

const SceneMap = {
  [Scene_Menu]: Menu,
  [Scene_Settings]: Settings,
  [Scene_GameClassic]: GameClassic,
  [Scene_GameMarathon]: GameMarathon,
  [Scene_GameResults]: GameResults,
  [Scene_GameEstimate]: GameEstimate,
}

function MathAttack() {
  const currentScene = useSelector(selectCurrentScene)

  let SceneComponent = SceneMap[currentScene]

  if (!SceneComponent) {
    throw new Error(`Scene missing "${currentScene}"`)
  }

  return (
    <View>
      <SceneComponent />
    </View>
  )
}

export default MathAttack
