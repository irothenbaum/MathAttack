import {startNewGame} from '../redux/GameSlice'
import {
  Scene_GameClassic,
  Scene_GameCrescendo,
  Scene_GameDailyChallenge,
  Scene_GameEstimate,
  Scene_GameMarathon,
  Scene_GameVersus,
} from '../constants/scenes'
import {goToScene} from '../redux/NavigationSlice'
import {useDispatch, useSelector} from 'react-redux'
import {selectGameSettings} from '../redux/selectors'

function usePlayGame() {
  const dispatch = useDispatch()
  const settings = useSelector(selectGameSettings)

  return {
    play: (game, sceneParams) => {
      switch (game) {
        case Scene_GameCrescendo:
        case Scene_GameEstimate:
        case Scene_GameMarathon:
        case Scene_GameVersus:
        case Scene_GameClassic:
        case Scene_GameDailyChallenge:
          dispatch(startNewGame(game, settings))
          dispatch(goToScene(game, sceneParams))
          break

        default:
          throw new Error(`Unknown game "${game}"`)
      }
    },
  }
}

export default usePlayGame
