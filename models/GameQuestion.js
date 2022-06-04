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
   * @param {number?} term1
   * @returns {GameQuestion}
   */
  static getRandomFromSettings(GameSettings, term1) {
    return new GameQuestion(Equation.getRandomFromSettings(GameSettings, term1), Date.now(), Date.now() + GameSettings.equationDuration)
  }

  /**
   * @param {GameSettings} GameSettings
   */
  static getRandomEstimateQuestionFromSettings(GameSettings) {
    let equation
    let count = GameSettings.estimateItems
    do {
      equation = Equation.getRandomFromSettings(GameSettings, equation?.phrase)
      count--
    } while (count > 0)

    return new GameQuestion(equation, Date.now(), Date.now() + GameSettings.equationDuration)
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
