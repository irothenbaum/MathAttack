import {createSlice} from '@reduxjs/toolkit'

const navigationSlice = createSlice({
  name: 'Navigation',
  initialState: {
    answerInput: '',
    answer: null,
  },
  reducers: {
    setAnswer: (state, {payload}) => {
      state.answerInput = ('' + payload).substr(0, 6)
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
