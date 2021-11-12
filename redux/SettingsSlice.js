import {createSlice} from '@reduxjs/toolkit'

const settingsSlice = createSlice({
  name: 'Settings',
  initialState: {
    minValue: 0,
    maxValue: 100,
    allowDecimals: false,
  },
  reducers: {
    setMinMaxValues: (state, {payload}) => {
      state.minValue = payload.min
      state.maxValue = payload.max
    },
    setAllowDecimals: (state, {payload}) => {
      state.allowDecimals = payload
    },
  },
})

export const setMinMaxValues = (min, max) => dispatch =>
  dispatch(settingsSlice.actions.setMinMaxValues({min: min, max: max}))
export const setAllowDecimals = isAllowed => dispatch =>
  dispatch(settingsSlice.actions.setAllowDecimals(isAllowed))

export default settingsSlice.reducer
