import {createSlice} from '@reduxjs/toolkit'

const navigationSlice = createSlice({
  name: 'Navigation',
  initialState: {
    answerInput: '',
    answer: null,
  },
  reducers: {
    setAnswer: (state, {payload}) => {
      const answer = parseFloat(payload)
      return {
        ...state,
        answerInput: ('' + payload).substr(0, 6),
        answer: isNaN(answer) ? null : answer,
      }
    },
  },
})

export const setAnswer = (scene) => (dispatch) => dispatch(navigationSlice.actions.setAnswer(scene))

export default navigationSlice.reducer
