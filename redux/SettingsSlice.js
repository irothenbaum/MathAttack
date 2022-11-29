import {createSlice} from '@reduxjs/toolkit'
import GameSettings from '../models/GameSettings'

const settingsSlice = createSlice({
  name: 'Settings',
  initialState: {...GameSettings},
  reducers: {
    setMinMaxValues: (state, {payload}) => {
      return {...state, minValue: payload.min, maxValue: payload.max}
    },
    setDecimalPlaces: (state, {payload}) => {
      return {...state, decimalPlaces: payload}
    },
    setEquationDuration: (state, {payload}) => {
      return {...state, equationDuration: payload}
    },
    setAutoSubmitCorrect: (state, {payload}) => {
      return {...state, autoSubmit: payload}
    },
    setMuteSounds: (state, {payload}) => {
      return {...state, muteSounds: payload}
    },
    setDisableVibration: (state, {payload}) => {
      return {...state, disableVibration: payload}
    },
    setColorScheme: (state, {payload}) => {
      return {...state, colorScheme: payload}
    },
    hydrateFromCache: (state, {payload}) => {
      return {...state, ...payload}
    },
  },
})

export const setMinMaxValues = (min, max) => (dispatch) => dispatch(settingsSlice.actions.setMinMaxValues({min: min, max: max}))
export const setDecimalPlaces = (places) => (dispatch) => dispatch(settingsSlice.actions.setDecimalPlaces(places))
export const setEquationDuration = (durationMS) => (dispatch) => dispatch(settingsSlice.actions.setEquationDuration(durationMS))
export const setAutoSubmitCorrect = (isActive) => (dispatch) => dispatch(settingsSlice.actions.setAutoSubmitCorrect(isActive))
export const setMuteSounds = (isMuted) => (dispatch) => dispatch(settingsSlice.actions.setMuteSounds(isMuted))
export const setDisableVibration = (isDisabled) => (dispatch) => dispatch(settingsSlice.actions.setDisableVibration(isDisabled))
export const hydrateFromCache = (payload) => (dispatch) => dispatch(settingsSlice.actions.hydrateFromCache(payload))
export const setColorScheme = (payload) => (dispatch) => dispatch(settingsSlice.actions.setColorScheme(payload))

export default settingsSlice.reducer
