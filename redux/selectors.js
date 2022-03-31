import {
  Scene_GameClassic,
  Scene_GameEstimate,
  Scene_GameMarathon,
  Scene_GameVersus,
} from '../constants/scenes'

export const selectCurrentScene = state => state.Navigation.currentScene
export const selectCurrentSceneParams = state =>
  state.Navigation.currentSceneParams
export const selectUserAnswer = state => state.UI.answer
export const selectUserInput = state => state.UI.answerInput
export const selectEquationDuration = state => state.Settings.equationDuration
export const selectCurrentQuestion = state => state.Game.currentQuestion
export const selectGameSettings = state => state.Settings
export const selectClassicGameResults = state => state.Game.questionResults
export const selectLastGameTypePlayed = state => state.Global.currentGame

export const selectLastGameResults = state => {
  const lastGameType = selectLastGameTypePlayed(state)
  switch (lastGameType) {
    case Scene_GameClassic:
      return selectClassicGameResults(state)

    case Scene_GameMarathon:
      return selectClassicGameResults(state)

    case Scene_GameEstimate:
      return selectClassicGameResults(state)

    case Scene_GameVersus:
      return selectClassicGameResults(state)

    default:
      throw new Error(
        'Cannot get last game results currentGame = ' +
          state.Global.currentGame,
      )
  }
}
