import {createSlice} from '@reduxjs/toolkit'
import GameQuestion from '../models/GameQuestion'
import QuestionResult from '../models/QuestionResult'
import {serializeObject} from '../lib/utilities'

const INITIAL_STATE = {
  settings: {},
  questionResults: [],
  currentQuestion: undefined,
}

const gameSlice = createSlice({
  name: 'Game',
  initialState: INITIAL_STATE,
  reducers: {
    recordAnswer: (state, {payload}) => {
      let result = new QuestionResult(
        state.currentQuestion,
        payload,
        Date.now() - state.currentQuestion.createdAt,
      )
      state.questionResults = [
        ...state.questionResults,
        serializeObject(result),
      ]
    },
    generateNewQuestion: (state, {payload}) => {
      state.currentQuestion = serializeObject(
        GameQuestion.getRandomFromSettings(state.settings, payload),
      )
    },
    startNewGame: (state, {payload}) => {
      Object.assign(state, INITIAL_STATE, {settings: payload})
    },
    deductTimeRemaining: (state, {payload}) => {
      // you lose half the time remaining
      state.currentQuestion = {
        ...state.currentQuestion,
        // we shift both because we want the total to remain consistent
        createdAt: state.currentQuestion.createdAt - payload,
        expiresAt: state.currentQuestion.expiresAt - payload,
      }
    },
  },
})

export const recordAnswer = answer => dispatch =>
  dispatch(gameSlice.actions.recordAnswer(answer))
// When you start a new game, we freeze the settings object so it must be passed into this function
export const startNewGame = classicGameSettings => dispatch => {
  dispatch(gameSlice.actions.startNewGame(classicGameSettings))
}
export const generateNewQuestion = term1 => dispatch =>
  dispatch(gameSlice.actions.generateNewQuestion(term1))

export const deductTimeRemaining = amount => dispatch =>
  dispatch(gameSlice.actions.deductTimeRemaining(amount))

export default gameSlice.reducer
