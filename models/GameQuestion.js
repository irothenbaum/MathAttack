import Equation from './Equation'

class GameQuestion {
  /**
   * @param {Equation} equation
   * @param {number} createdAt
   * @param {number} expiresAt
   */
  constructor(equation, createdAt, expiresAt) {
    this.equation = equation
    this.createdAt = createdAt
    this.expiresAt = expiresAt
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
   * @param {{expiresAt: number}} obj
   * @returns {number}
   */
  static getMSRemaining(obj) {
    return obj.expiresAt - Date.now()
  }
}

export default GameQuestion
