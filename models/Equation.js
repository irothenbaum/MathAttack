function roundIfNeeded(value, decimalPlaces) {
  let decimalBase = Math.round(Math.pow(10, decimalPlaces))
  return Math.round(value * decimalBase) / decimalBase
}

const OPERATION_ADD = '+'
const OPERATION_SUBTRACT = '-'

class Equation {
  /**
   * @param {number} term1
   * @param {Operation} operation
   * @param {number} term2
   */
  constructor(term1, operation, term2) {
    this.term1 = term1
    this.operation = operation
    this.term2 = term2
  }

  /**
   * @param {GameSettings} GameSettings
   * @returns {Equation}
   */
  static getRandomFromSettings(GameSettings) {
    let answer = roundIfNeeded(
      Math.random() *
        (GameSettings.minValue +
          (GameSettings.maxValue - GameSettings.minValue)),
      GameSettings.decimalPlaces,
    )

    let term1
    do {
      term1 = roundIfNeeded(
        answer - Math.random() * 2 * answer,
        GameSettings.decimalPlaces,
      )
    } while (term1 === 0 || term1 === answer)

    let term2 = roundIfNeeded(answer - term1, GameSettings.decimalPlaces)

    // might choose to swap the order so that term 2 has a chance to be negative
    if (Math.round(Math.random()) === 1) {
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

    return new Equation(term1, operation, term2)
  }

  /**
   * @param {Equation} obj
   * @returns {string}
   */
  static getLeftSide(obj) {
    return `${obj.term1} ${obj.operation.toString()} ${obj.term2}`
  }

  /**
   * @param {Equation} obj
   */
  static getSolution(obj) {
    switch (obj.operation) {
      case OPERATION_ADD:
        return obj.term1 + obj.term2

      case OPERATION_SUBTRACT:
        return obj.term1 - obj.term2

      default:
        throw new Error('Unrecognized operation ' + obj.operation)
    }
  }
}

export default Equation
