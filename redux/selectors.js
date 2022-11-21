import {ALL_GAMES} from '../constants/game'

export const selectCurrentScene = (state) => state.Navigation.currentScene
export const selectCurrentSceneParams = (state) => state.Navigation.currentSceneParams
export const selectUserAnswer = (state) => state.UI.answer
export const selectUserInput = (state) => state.UI.answerInput
export const selectCurrentQuestion = (state) => state.Game.currentQuestion
export const selectGameSettings = (state) => state.Settings
export const selectClassicGameResults = (state) => state.Game.questionResults
export const selectLastGameTypePlayed = (state) => state.Game.currentGame
export const selectHighScoresForGame = (state, game) => state.HighScores.highScores[game] || []
export const selectHighScoresForLastGamePlayed = (state) => selectHighScoresForGame(state, selectLastGameTypePlayed(state))
export const selectViewingGameResult = (state) => state.HighScores.viewingGameResult

export const selectLastGameResults = (state) => {
  const lastGameType = selectLastGameTypePlayed(state)

  if (ALL_GAMES.includes(lastGameType)) {
    return selectClassicGameResults(state)
  }
  throw new Error('Cannot get last game results currentGame = ' + state.Game.currentGame)
}
