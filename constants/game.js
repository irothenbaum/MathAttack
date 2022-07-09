import {Scene_GameClassic, Scene_GameEstimate, Scene_GameMarathon, Scene_GameVersus} from './scenes'

export const ANSWER_TIMEOUT = -99999.1

export const GAME_LABEL_CLASSIC = 'Classic'
export const GAME_LABEL_MARATHON = 'Marathon'
export const GAME_LABEL_ESTIMATE = 'Estimation'
export const GAME_LABEL_VERSUS = 'Versus'

export const SCENE_TO_LABEL = {
  [Scene_GameClassic]: GAME_LABEL_CLASSIC,
  [Scene_GameMarathon]: GAME_LABEL_MARATHON,
  [Scene_GameEstimate]: GAME_LABEL_ESTIMATE,
  [Scene_GameVersus]: GAME_LABEL_VERSUS,
}

export const SLAM_ANIMATION_DURATION = 1500

export const SCENE_CHANGE_TRANSITION_DURATION = 250

export const COLOR_SCHEME_LIGHT = 1
export const COLOR_SCHEME_DARK = -1
export const COLOR_SCHEME_SYSTEM = 0
