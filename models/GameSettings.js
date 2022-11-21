import {COLOR_SCHEME_LIGHT} from '../constants/game'

/** @typedef GameSettings */
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
  equationDuration: 5000,
  classicNumberOfRounds: 6,

  // marathon:
  numberOfStrikes: 3,

  // estimate:
  estimateItems: 4,

  // crescendo:
  crescendoRoundDuration: 1000000, // 10000,
}

export default GameSettings
