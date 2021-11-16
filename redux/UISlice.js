import {createSlice} from '@reduxjs/toolkit'
import {Scene_Menu} from '../constants/scenes'

const navigationSlice = createSlice({
  name: 'Navigation',
  initialState: {
    answerInput: '',
    answer: null,
  },
  reducers: {
    setAnswer: (state, {payload}) => {
      state.answerInput = '' + payload
      state.answer = parseFloat(payload)
      if (isNaN(state.answer)) {
        state.answer = null
      }
    },
  },
})

export const setAnswer = scene => dispatch =>
  dispatch(navigationSlice.actions.setAnswer(scene))

export default navigationSlice.reducer
