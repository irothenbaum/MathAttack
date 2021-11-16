import Equation from './Equation'
import Serializable from './Serializable'

class GameQuestion extends Serializable {
  /**
   * @param {Equation} equation
   * @param {number} createdAt
   * @param {number} expiresAt
   */
  constructor(equation, createdAt, expiresAt) {
    super()
    this.equation = equation
    this.createdAt = createdAt
    this.expiresAt = expiresAt
  }

  /**
   * @returns {number}
   */
  getMSRemaining() {
    return this.expiresAt - this.createdAt
  }

  /**
   * @returns {string}
   */
  toString() {
    return this.equation.toString()
  }

  /**
   * @param {GameSettings} GameSettings
   * @returns {GameQuestion}
   */
  static getRandomFromSettings(GameSettings) {
    return new GameQuestion(
      Equation.getRandomFromSettings(GameSettings),
      Date.now(),
      Date.now() + GameSettings.equationDuration,
    )
  }

  /**
   * @param {{equation: *, createdAt: number, expiresAt: number}} obj
   * @returns {GameQuestion}
   */
  static createFromPlainObject(obj) {
    return new GameQuestion(
      Equation.createFromPlainObject(obj.equation),
      obj.createdAt,
      obj.expiresAt,
    )
  }
}

export default GameQuestion
