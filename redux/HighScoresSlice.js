import {createSlice} from '@reduxjs/toolkit'
import {serializeObject} from '../lib/utilities'
import {ALL_GAMES} from '../constants/game'

// keep the top 20 only
const HIGH_SCORE_TABLE_COUNT = 20

const highScoresSlice = createSlice({
  name: 'HighScores',
  initialState: {
    // if we change the scoring logic in a meaningful way, we'll need to be able to clear the scores properly.
    // we'll use this version number to do that (somehow, later)
    scoreVersion: 1,
    // start off every high scores entry with an empty array
    highScores: ALL_GAMES.map((agr, g) => {
      agr[g] = []
      return agr
    }, {}),
    viewingGameResult: null,
  },
  reducers: {
    clearHighScores: (state, {payload}) => {
      state.highScores[payload] = []
    },

    recordHighScore: (state, {payload}) => {
      state.highScores[payload.game] = [...(state.highScores[payload.game] || []), payload]
        .sort((a, b) => {
          return a.finalScore < b.finalScore
            ? 1
            : a.finalScore > b.finalScore
            ? -1
            : a.dateCreated < b.dateCreated
            ? -1
            : a.dateCreated > b.dateCreated
            ? 1
            : 0
        })
        .slice(0, HIGH_SCORE_TABLE_COUNT)
    },
    hydrateFromCache: (state, {payload}) => {
      if (payload.scoreVersion === state.scoreVersion) {
        return {...state, ...payload}
      }
      return state
    },

    setViewingGameResult: (state, {payload}) => {
      if (payload.game && payload.resultId) {
        state.viewingGameResult = state.highScores[payload.game].find((g) => g.id === payload.resultId)
      } else {
        state.viewingGameResult = null
      }
      return state
    },
  },
})

/** @param {GameResult} result */
export const recordHighScore = (result) => (dispatch) => dispatch(highScoresSlice.actions.recordHighScore(serializeObject(result)))

export const clearHighScores = (game) => (dispatch) => dispatch(highScoresSlice.actions.clearHighScores(game))
export const hydrateFromCache = (payload) => (dispatch) => dispatch(highScoresSlice.actions.hydrateFromCache(payload))

/**
 * @param {string?} game
 * @param {string?} resultId
 * @returns {function(*): *}
 */
export const setViewingGameResult = (game, resultId) => (dispatch) =>
  dispatch(highScoresSlice.actions.setViewingGameResult({game: game, resultId: resultId}))

export default highScoresSlice.reducer
