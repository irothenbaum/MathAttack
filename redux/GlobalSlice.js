import {createSlice} from '@reduxjs/toolkit'
import {Scene_Menu} from '../constants/scenes'

const globalSlice = createSlice({
  name: 'Navigation',
  initialState: {
    currentGame: null,
  },
  reducers: {
    setCurrentGame: (state, {payload}) => {
      state.currentGame = payload
    },
  },
})

export const setCurrentGame = game => dispatch =>
  dispatch(globalSlice.actions.setCurrentGame(game))

export default globalSlice.reducer
