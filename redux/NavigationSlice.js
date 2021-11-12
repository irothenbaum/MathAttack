import {createSlice} from '@reduxjs/toolkit'
import {Menu} from '../constants/scenes'

const navigationSlice = createSlice({
  name: 'Navigation',
  initialState: {
    currentScene: Menu,
  },
  reducers: {
    goToScene: (state, {payload}) => {
      state.currentScene = payload
    },
  },
})

export const goToScene = scene => dispatch =>
  dispatch(navigationSlice.actions.goToScene(scene))

export default navigationSlice.reducer
