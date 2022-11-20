import NotificationHelper from './NotificationHelper'
import Equation from '../models/Equation'
import {GAME_LABEL_DAILY_CHALLENGE} from '../constants/game'
import moment from 'moment'
import {Scene_GameDailyChallenge} from '../constants/scenes'

/**
 * @typedef DailyChallengeParam
 * @property {Equation} equation
 */

const REMINDER_1 = 'one-day-challenge' // 1 day
const REMINDER_2 = 'three-day-challenge' // 2 days
const REMINDER_3 = 'one-week-challenge' // 4 days
const REMINDER_4 = 'two-week-challenge' // 7 days
const REMINDER_5 = 'one-month-challenge' // ~18 days
const REMINDER_6 = 'two-month-challenge' // ~30 days

const REMINDER_DAYS_MAP = {
  [REMINDER_1]: 1,
  [REMINDER_2]: 3,
  [REMINDER_3]: 7,
  [REMINDER_4]: 14,
  [REMINDER_5]: 30,
  [REMINDER_6]: 60,
}

const PROMPT_PLACEHOLDER = ':EQUATION:'
const PROMPTS = [
  `Quick, what's ${PROMPT_PLACEHOLDER}?`,
  `Hey, do you know what ${PROMPT_PLACEHOLDER} equals?`,
  `Got an easy one for ya: ${PROMPT_PLACEHOLDER}`,
  `Brain train time! What's ${PROMPT_PLACEHOLDER}?`,
  `Use it or lose it: ${PROMPT_PLACEHOLDER} = ?`,
  `Quick, what's ${PROMPT_PLACEHOLDER}?`,
]

/**
 * @param {Equation} e
 * @return {string}
 */
function getRandomPrompt(e) {
  return PROMPTS[Math.floor(Math.random() * PROMPTS.length)].replace(PROMPT_PLACEHOLDER, Equation.getLeftSide(e))
}

/**
 * @param {GameSettings} gameSettings
 */
function scheduleReminders(gameSettings) {
  clearReminders()

  Object.keys(REMINDER_DAYS_MAP).forEach((reminderId) => scheduleSingleReminder(gameSettings, reminderId))
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
    JSON.stringify({equation: equation}),
  )
}

function clearReminders() {
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
