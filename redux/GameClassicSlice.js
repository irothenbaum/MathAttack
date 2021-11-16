import {createSlice} from '@reduxjs/toolkit'
import GameQuestion from '../models/GameQuestion'
import QuestionResult from '../models/QuestionResult'

const gameClassicSlice = createSlice({
  name: 'GameClassic',
  initialState: {
    settings: {},
    isPlaying: false,
    questionResults: [],
    currentQuestion: undefined,
  },
  reducers: {
    recordAnswer: (state, {payload}) => {
      let result = new QuestionResult(state.currentQuestion, payload)
      state.questionResults = [...state.questionResults, result.toPlainObject()]
    },
    generateNewQuestion: state => {
      state.currentQuestion = GameQuestion.getRandomFromSettings(
        state.settings,
      ).toPlainObject()
    },
    setCurrentQuestion: (state, {payload}) => {
      state.currentQuestion = payload
    },
    startNewGame: (state, {payload}) => {
      state.questionResults = []
      state.isPlaying = true
      state.settings = payload
      state.currentQuestion = GameQuestion.getRandomFromSettings(
        state.settings,
      ).toPlainObject()
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
export const setCurrentQuestion = gameQuestion => dispatch =>
  dispatch(gameClassicSlice.actions.setCurrentQuestion(gameQuestion))

export const deductTimeRemaining = amount => dispatch =>
  dispatch(gameClassicSlice.actions.deductTimeRemaining(amount))

export default gameClassicSlice.reducer
