import {createSlice} from '@reduxjs/toolkit'
import GameQuestion from '../models/GameQuestion'
import QuestionResult from '../models/QuestionResult'
import {serializeObject} from '../lib/utilities'

const INITIAL_STATE = {
  settings: {},
  questionResults: [],
  currentGame: undefined,
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
      state.currentQuestion = payload
    },
    startNewGame: (state, {payload}) => {
      Object.assign(state, INITIAL_STATE, {settings: payload.settings, currentGame: payload.game})
    },

    generateNewEstimationQuestion: (state) => {
      state.currentQuestion = serializeObject(GameQuestion.getRandomEstimateQuestionFromSettings(state.settings))
    },

    generateNewFractionsQuestion: (state, {payload}) => {
      state.currentQuestion = serializeObject(GameQuestion.getRandomFractionQuestionFromSettings(state.settings))
    },

    generateNewCrescendoQuestion: (state, {payload}) => {
      state.currentQuestion = serializeObject(GameQuestion.getRandomCrescendoQuestionFromSettings(state.settings, payload))
    },
  },
})

/** @param {number} answer */
export const recordAnswer = (answer) => (dispatch) => dispatch(gameSlice.actions.recordAnswer(answer))

// When you start a new game, we freeze the settings object so it must be passed into this function
/**
 * @param {string} game
 * @param {GameSettings} classicGameSettings
 */
export const startNewGame = (game, classicGameSettings) => (dispatch) => {
  dispatch(gameSlice.actions.startNewGame({game: game, settings: classicGameSettings}))
}

/** @param {number?} term1 */
export const generateNewQuestion = (term1) => (dispatch) => dispatch(gameSlice.actions.generateNewQuestion(term1))

export const generateNewEstimationQuestion = () => (dispatch) => dispatch(gameSlice.actions.generateNewEstimationQuestion())

export const generateNewFractionsQuestion = () => (dispatch) => dispatch(gameSlice.actions.generateNewFractionsQuestion())

/** @param {number} termsCount */
export const generateNewCrescendoQuestion = (termsCount) => (dispatch) =>
  dispatch(gameSlice.actions.generateNewCrescendoQuestion(termsCount))

/** @param {GameQuestion} q */
export const setCurrentQuestion = (q) => (dispatch) => dispatch(gameSlice.actions.setCurrentQuestion(serializeObject(q)))

export default gameSlice.reducer
