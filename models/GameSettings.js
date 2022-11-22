import {COLOR_SCHEME_LIGHT} from '../constants/game'

/**
 * @typedef GameSettings
 * @property {boolean} muteSounds
 * @property {boolean} disableVibration
 * @property {number} colorScheme
 * @property {number} minValue
 * @property {number} maxValue
 * @property {number} decimalPlaces
 * @property {boolean} autoSubmit
 * @property {boolean} allowNegative
 * @property {number} equationDuration
 * @property {number} classicNumberOfRounds
 * @property {number} numberOfStrikes
 * @property {number} estimateItems
 * @property {number} crescendoRoundDuration
 */
const GameSettings = {
  // shared:
  muteSounds: false,
  disableVibration: false,
  colorScheme: COLOR_SCHEME_LIGHT, // default to Light
  minValue: 0,
  maxValue: 100,
  decimalPlaces: 0,
  autoSubmit: true,
  allowNegative: true,

  // classic
  equationDuration: 50000000, // 5000,
  classicNumberOfRounds: 6,

  // marathon:
  numberOfStrikes: 3,

  // estimate:
  estimateItems: 4,

  // crescendo:
  crescendoRoundDuration: Number.MAX_SAFE_INTEGER,
}

export default GameSettings
