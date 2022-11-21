import {Platform, Vibration} from 'react-native'

export const VIBRATE_ONCE_WRONG = 500
// export const VIBRATE_PATTERN_WRONG = Platform.OS === 'android' ? [0, ] : []

class VibrateHelper {
  /**
   * @param {Array<number>} pattern
   */
  vibratePattern(pattern) {
    Vibration.vibrate(pattern)
  }

  /**
   * @param {number?} duration
   */
  vibrateOnce(duration) {
    Vibration.vibrate(duration)
  }

  /**
   * @param {Array<number> | number?} pattern
   */
  vibrateStart(pattern) {
    Vibration.vibrate(pattern || Number.MAX_SAFE_INTEGER, true)
  }

  /**
   */
  vibrateStop() {
    Vibration.cancel()
  }

  /**
   * @returns {VibrateHelper}
   * @constructor
   */
  static Instance() {
    if (!VibrateHelper._INSTANCE) {
      VibrateHelper._INSTANCE = new VibrateHelper()
    }

    return VibrateHelper._INSTANCE
  }
}

export default VibrateHelper
