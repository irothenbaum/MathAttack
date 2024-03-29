import {createSlice} from '@reduxjs/toolkit'
import {Scene_Menu} from '../constants/scenes'
import {SCENE_CHANGE_TRANSITION_DURATION} from '../constants/game'

const navigationSlice = createSlice({
  name: 'Navigation',
  initialState: {
    currentScene: Scene_Menu,
    currentSceneParams: null,
    isTransitioningToScene: null,
  },
  reducers: {
    startTransitionToScene: (state, {payload}) => {
      return {...state, isTransitioningToScene: payload}
    },
    finishTransitionToScene: (state, {payload}) => {
      return {...state, isTransitioningToScene: null, currentScene: payload.scene, currentSceneParams: payload.params}
    },
  },
})

export const goToScene = (scene, params) => (dispatch) => {
  dispatch(navigationSlice.actions.startTransitionToScene(scene))
  setTimeout(() => {
    dispatch(navigationSlice.actions.finishTransitionToScene({scene: scene, params: params}))
  }, SCENE_CHANGE_TRANSITION_DURATION)
}

export default navigationSlice.reducer
