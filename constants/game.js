import {
  Scene_GameClassic,
  Scene_GameEstimate,
  Scene_GameMarathon,
} from './scenes'

export const ANSWER_TIMEOUT = -99999.1

export const GAME_LABEL_CLASSIC = 'Classic'
export const GAME_LABEL_MARATHON = 'Marathon'
export const GAME_LABEL_ESTIMATE = 'Estimation'

export const SCENE_TO_LABEL = {
  [Scene_GameClassic]: GAME_LABEL_CLASSIC,
  [Scene_GameMarathon]: GAME_LABEL_MARATHON,
  [Scene_GameEstimate]: GAME_LABEL_ESTIMATE,
}
