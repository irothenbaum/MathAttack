import {createSlice} from '@reduxjs/toolkit'
import {Scene_Menu} from '../constants/scenes'

const navigationSlice = createSlice({
  name: 'Navigation',
  initialState: {
    currentScene: Scene_Menu,
    currentSceneParams: null,
  },
  reducers: {
    goToScene: (state, {payload}) => {
      state.currentScene = payload.scene
      state.currentSceneParams = payload.params

      console.log(state.currentSceneParams)
    },
  },
})

export const goToScene = (scene, params) => dispatch =>
  dispatch(navigationSlice.actions.goToScene({scene: scene, params: params}))

export default navigationSlice.reducer
