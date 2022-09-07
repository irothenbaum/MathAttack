import {createSlice} from '@reduxjs/toolkit'
import {Scene_GameClassic, Scene_GameEstimate, Scene_GameMarathon, Scene_GameCrescendo} from '../constants/scenes'
import {serializeObject} from '../lib/utilities'

// keep the top 10 only
const HIGH_SCORE_TABLE_COUNT = 10

const highScoresSlice = createSlice({
  name: 'HighScores',
  initialState: {
    // if we change the scoring logic in a meaningful way, we'll need to be able to clear the scores properly.
    // we'll use this version number to do that (somehow, later)
    scoreVersion: 1,
    highScores: {
      [Scene_GameClassic]: [],
      [Scene_GameEstimate]: [],
      [Scene_GameMarathon]: [],
      [Scene_GameCrescendo]: [],
    },
  },
  reducers: {
    clearHighScores: (state, {payload}) => {
      state.highScores[payload] = []
    },

    recordHighScore: (state, {payload}) => {
      state.highScores[payload.game] = [...state.highScores[payload.game], payload]
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
  },
})

/** @param {GameResult} result */
export const recordHighScore = (result) => (dispatch) => dispatch(highScoresSlice.actions.recordHighScore(serializeObject(result)))

export const clearHighScores = (game) => (dispatch) => dispatch(highScoresSlice.actions.clearHighScores(game))
export const hydrateFromCache = (payload) => (dispatch) => dispatch(highScoresSlice.actions.hydrateFromCache(payload))

export default highScoresSlice.reducer
