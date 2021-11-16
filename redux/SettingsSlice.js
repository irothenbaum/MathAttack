import {createSlice} from '@reduxjs/toolkit'
import GameSettings from '../models/GameSettings'

const settingsSlice = createSlice({
  name: 'Settings',
  initialState: {...GameSettings},
  reducers: {
    setMinMaxValues: (state, {payload}) => {
      state.minValue = payload.min
      state.maxValue = payload.max
    },
    setDecimalPlaces: (state, {payload}) => {
      state.decimalPlaces = payload
    },
    setEquationDuration: (state, {payload}) => {
      state.equationDuration = payload
    },
  },
})

export const setMinMaxValues = (min, max) => dispatch =>
  dispatch(settingsSlice.actions.setMinMaxValues({min: min, max: max}))
export const setDecimalPlaces = places => dispatch =>
  dispatch(settingsSlice.actions.setDecimalPlaces(places))
export const setEquationDuration = durationMS => dispatch =>
  dispatch(settingsSlice.action.setEquationDuration(durationMS))

export default settingsSlice.reducer
