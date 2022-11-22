import NotificationHelper from './NotificationHelper'
import Equation from '../models/Equation'
import {GAME_LABEL_DAILY_CHALLENGE} from '../constants/game'
import moment from 'moment'
import {Scene_GameDailyChallenge} from '../constants/scenes'
import {selectRandom} from './utilities'

/**
 * @typedef DailyChallengeParam
 * @property {Equation} equation
 */

const REMINDER_1 = 5001
const REMINDER_2 = 5002
const REMINDER_3 = 5003
const REMINDER_4 = 5004
const REMINDER_5 = 5005
const REMINDER_6 = 5006

const REMINDER_DAYS_MAP = {
  [REMINDER_1]: 1, // 1 day later
  [REMINDER_2]: 3, // 2 days later
  [REMINDER_3]: 7, // 4 days later
  [REMINDER_4]: 14, // 7 days later
  [REMINDER_5]: 30, // ~18 days later
  [REMINDER_6]: 60, // ~30 days later
}

const PROMPT_PLACEHOLDER = ':EQUATION:'
const PROMPTS = [
  `Quick, what's ${PROMPT_PLACEHOLDER}?`,
  `Hey, do you know what ${PROMPT_PLACEHOLDER} equals?`,
  `Got an easy one for ya: ${PROMPT_PLACEHOLDER}`,
  `Brain train time! What's ${PROMPT_PLACEHOLDER}?`,
  `Use it or lose it: ${PROMPT_PLACEHOLDER} = ?`,
  `Be my calculator: ${PROMPT_PLACEHOLDER}`,
  `Quick, what's ${PROMPT_PLACEHOLDER}?`,
]

/**
 * @param {Equation} e
 * @return {string}
 */
function getRandomPrompt(e) {
  return selectRandom(PROMPTS).replace(PROMPT_PLACEHOLDER, Equation.getLeftSide(e))
}

/**
 * @param {GameSettings} gameSettings
 */
export function scheduleReminders(gameSettings) {
  clearReminders()

  Object.keys(REMINDER_DAYS_MAP).forEach((reminderId) => scheduleSingleReminder(gameSettings, reminderId))

  // NotificationHelper.Instance()
  //   .getScheduled()
  //   .then((notifications) => console.log(`Scheduled ${notifications.length} notifications`))
}

/**
 * @param {GameSettings} gameSettings
 * @param {string} id
 */
function scheduleSingleReminder(gameSettings, id) {
  const equation = Equation.getRandomFromSettings(gameSettings)
  NotificationHelper.Instance().scheduleLocalNotification(
    id,
    GAME_LABEL_DAILY_CHALLENGE,
    getRandomPrompt(equation),
    moment().add(REMINDER_DAYS_MAP[id], 'day').startOf('days').add(12, 'hours').toDate(),
    Scene_GameDailyChallenge,
    // this matches the DailyChallengeParam typedef above
    JSON.stringify({equation: equation}),
  )
}

export function clearReminders() {
  NotificationHelper.Instance().cancelScheduledLocalNotification(REMINDER_1)
  NotificationHelper.Instance().cancelScheduledLocalNotification(REMINDER_2)
  NotificationHelper.Instance().cancelScheduledLocalNotification(REMINDER_3)
  NotificationHelper.Instance().cancelScheduledLocalNotification(REMINDER_4)
  NotificationHelper.Instance().cancelScheduledLocalNotification(REMINDER_5)
  NotificationHelper.Instance().cancelScheduledLocalNotification(REMINDER_6)
}

export default {
  scheduleReminders,
  clearReminders,
}
