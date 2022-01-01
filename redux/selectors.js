export const selectCurrentScene = state => state.Navigation.currentScene
export const selectUserAnswer = state => state.UI.answer
export const selectUserInput = state => state.UI.answerInput
export const selectEquationDuration = state => state.Settings.equationDuration
export const selectCurrentQuestion = state => state.GameClassic.currentQuestion
export const selectClassicGameSettings = state => state.Settings
export const selectUIAnimation = state => state.UI.uiAnimation
export const selectIsUiAnimationForCorrect = state =>
  state.UI.uiAnimationIsForCorrect
