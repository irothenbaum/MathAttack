import {Scene_GameClassic} from '../constants/scenes'

export const selectCurrentScene = state => state.Navigation.currentScene
export const selectCurrentSceneParams = state =>
  state.Navigation.currentSceneParams
export const selectUserAnswer = state => state.UI.answer
export const selectUserInput = state => state.UI.answerInput
export const selectEquationDuration = state => state.Settings.equationDuration
export const selectCurrentQuestion = state => state.GameClassic.currentQuestion
export const selectClassicGameSettings = state => state.Settings
export const selectClassicGameResults = state =>
  state.GameClassic.questionResults

export const selectLastGameResults = state => {
  switch (state.Global.currentGame) {
    case Scene_GameClassic:
      return selectClassicGameResults(state)

    default:
      throw new Error(
        'Cannot get last game results currentGame = ' +
          state.Global.currentGame,
      )
  }
}
