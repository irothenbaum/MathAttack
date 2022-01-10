import {createSlice} from '@reduxjs/toolkit'
import GameQuestion from '../models/GameQuestion'
import QuestionResult from '../models/QuestionResult'
import {serializeObject} from '../lib/utilities'

const INITIAL_STATE = {
  settings: {},
  questionResults: [],
  currentQuestion: undefined,
}

const gameClassicSlice = createSlice({
  name: 'GameClassic',
  initialState: INITIAL_STATE,
  reducers: {
    recordAnswer: (state, {payload}) => {
      let result = new QuestionResult(state.currentQuestion, payload)
      state.questionResults = [
        ...state.questionResults,
        serializeObject(result),
      ]
    },
    generateNewQuestion: state => {
      state.currentQuestion = serializeObject(
        GameQuestion.getRandomFromSettings(state.settings),
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
  dispatch(gameClassicSlice.actions.recordAnswer(answer))
// When you start a new game, we freeze the settings object so it must be passed into this function
export const startNewGame = classicGameSettings => dispatch => {
  dispatch(gameClassicSlice.actions.startNewGame(classicGameSettings))
}
export const generateNewQuestion = () => dispatch =>
  dispatch(gameClassicSlice.actions.generateNewQuestion())

export const deductTimeRemaining = amount => dispatch =>
  dispatch(gameClassicSlice.actions.deductTimeRemaining(amount))

export default gameClassicSlice.reducer
