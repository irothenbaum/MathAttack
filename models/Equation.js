import Phrase, {OPERATION_SUBTRACT, OPERATION_ADD} from './Phrase'

function roundIfNeeded(value, decimalPlaces) {
  let decimalBase = Math.round(Math.pow(10, decimalPlaces))
  return Math.round(value * decimalBase) / decimalBase
}

class Equation {
  /**
   * @param {Phrase} phrase
   */
  constructor(phrase) {
    this.phrase = phrase
  }

  /**
   * @param {GameSettings} GameSettings
   * @param {number?} term1
   * @returns {Equation}
   */
  static getRandomFromSettings(GameSettings, term1) {
    let term1IsSet = typeof term1 === 'number'
    let answer
    do {
      answer = roundIfNeeded(
        GameSettings.minValue +
          Math.random() * (GameSettings.maxValue - GameSettings.minValue),
        GameSettings.decimalPlaces,
      )
    } while (answer === term1)

    if (!term1IsSet) {
      do {
        term1 = roundIfNeeded(
          answer - Math.random() * 2 * answer,
          GameSettings.decimalPlaces,
        )
      } while (term1 === 0 || term1 === answer)
    }

    let term2 = roundIfNeeded(answer - term1, GameSettings.decimalPlaces)

    // might choose to swap the order so that term 2 has a chance to be negative
    // if term1 was not passed
    if (!term1IsSet && Math.round(Math.random()) === 1) {
      let temp = term1
      term1 = term2
      term2 = temp
    }

    let operation
    if (term2 > 0) {
      operation = OPERATION_ADD
    } else {
      operation = OPERATION_SUBTRACT
      term2 = Math.abs(term2)
    }

    return new Equation(new Phrase(term1, operation, term2))
  }

  /**
   * @param {Equation} obj
   * @returns {string}
   */
  static getLeftSide(obj) {
    return Phrase.toString(obj.phrase)
  }

  /**
   * @param {Equation} obj
   */
  static getSolution(obj) {
    return Phrase.getSolution(obj.phrase)
  }
}

export default Equation
