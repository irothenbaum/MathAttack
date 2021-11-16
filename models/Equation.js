import Plus from './Plus'
import Minus from './Minus'
import Serializable from './Serializable'

function roundIfNeeded(value, decimalPlaces) {
  let decimalBase = Math.round(Math.pow(10, decimalPlaces))
  return Math.round(value * decimalBase) / decimalBase
}

class Equation extends Serializable {
  /**
   * @param {number} term1
   * @param {Operation} operation
   * @param {number} term2
   */
  constructor(term1, operation, term2) {
    super()
    this.term1 = term1
    this.operation = operation
    this.term2 = term2
  }

  /**
   * @returns {number}
   */
  getSolution() {
    if (typeof this.__solutionCache !== 'number') {
      this.__solutionCache = this.operation.operate(this.term1, this.term2)
    }

    return this.__solutionCache
  }

  getLeftSide() {
    return `${this.term1} ${this.operation.toString()} ${this.term2}`
  }

  toString() {
    return `${this.getLeftSide()} = ${this.getSolution()}`
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
      operation = new Plus()
    } else {
      operation = new Minus()
      term2 = Math.abs(term2)
    }

    return new Equation(term1, operation, term2)
  }

  /**
   * @param {{term1: number, operation: string, term2: number}} obj
   * @returns {Equation}
   */
  static createFromPlainObject(obj) {
    return new Equation(
      obj.term1,
      Equation.getOperationFromCharacter(obj.operation),
      obj.term2,
    )
  }

  /**
   * @param {string} char
   * @returns {Operation}
   */
  static getOperationFromCharacter(char) {
    switch (char) {
      case '+':
        return new Plus()
      case '-':
        return new Minus()
    }
    throw new Error(`Unrecognized character "${char}"`)
  }
}

export default Equation
