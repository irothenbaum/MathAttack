import {COLOR_SCHEME_SYSTEM} from '../constants/game'

const GameSettings = {
  // shared:
  muteSounds: false,
  colorScheme: COLOR_SCHEME_SYSTEM,
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
  crescendoRoundDuration: 10000,
}

export default GameSettings
