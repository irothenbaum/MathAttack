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
      let result = new QuestionResult(state.currentQuestion, payload, Date.now() - state.currentQuestion.createdAt)
      state.questionResults = [...state.questionResults, serializeObject(result)]
    },
    generateNewQuestion: (state, {payload}) => {
      state.currentQuestion = serializeObject(GameQuestion.getRandomFromSettings(state.settings, payload))
    },
    setCurrentQuestion: (state, {payload}) => {
      state.currentQuestion = serializeObject(payload)
    },
    startNewGame: (state, {payload}) => {
      Object.assign(state, INITIAL_STATE, {settings: payload})
    },

    generateNewEstimationQuestion: (state) => {
      state.currentQuestion = serializeObject(GameQuestion.getRandomEstimateQuestionFromSettings(state.settings))
    },
  },
})

/** @param {number} answer */
export const recordAnswer = (answer) => (dispatch) => dispatch(gameSlice.actions.recordAnswer(answer))

// When you start a new game, we freeze the settings object so it must be passed into this function
/** @param {GameSettings} classicGameSettings */
export const startNewGame = (classicGameSettings) => (dispatch) => {
  dispatch(gameSlice.actions.startNewGame(classicGameSettings))
}

/** @param {number?} term1 */
export const generateNewQuestion = (term1) => (dispatch) => dispatch(gameSlice.actions.generateNewQuestion(term1))

export const generateNewEstimationQuestion = () => (dispatch) => dispatch(gameSlice.actions.generateNewEstimationQuestion())

/** @param {GameQuestion} q */
export const setCurrentQuestion = (q) => (dispatch) => dispatch(gameSlice.actions.setCurrentQuestion(serializeObject(q)))

export default gameSlice.reducer
