import {
  startNewGame as startNewCrescendoGame,
  startNewGame as startNewVersusGame,
  startNewGame as startNewEstimateGame,
  startNewGame as startNewMarathonGame,
  startNewGame as startNewClassicGame,
} from '../redux/GameSlice'
import {setCurrentGame} from '../redux/GlobalSlice'
import {Scene_GameClassic, Scene_GameCrescendo, Scene_GameEstimate, Scene_GameMarathon, Scene_GameVersus} from '../constants/scenes'
import {goToScene} from '../redux/NavigationSlice'
import {useDispatch, useSelector} from 'react-redux'
import {selectGameSettings} from '../redux/selectors'

function usePlayGame() {
  const dispatch = useDispatch()
  const settings = useSelector(selectGameSettings)

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

  const handlePlayCrescendo = () => {
    dispatch(startNewCrescendoGame(settings))
    dispatch(setCurrentGame(Scene_GameCrescendo))
    dispatch(goToScene(Scene_GameCrescendo))
  }

  return {
    play: (game) => {
      switch (game) {
        case Scene_GameCrescendo:
          return handlePlayCrescendo()
        case Scene_GameEstimate:
          return handlePlayEstimation()
        case Scene_GameMarathon:
          return handlePlayMarathon()
        case Scene_GameVersus:
          return handlePlayVersus()
        case Scene_GameClassic:
          return handlePlayClassic()
        default:
          throw new Error(`Unknown game "${game}"`)
      }
    },
  }
}

export default usePlayGame
