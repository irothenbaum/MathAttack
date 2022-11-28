import Equation from './Equation'
import Phrase, {OPERATION_DIVIDE} from './Phrase'
import {OPERATION_ADD, OPERATION_SUBTRACT} from './Phrase'
import {v4 as uuid} from 'uuid'

class GameQuestion {
  /**
   * @param {Equation} equation
   * @param {number} createdAt
   * @param {number} expiresAt
   */
  constructor(equation, createdAt, expiresAt) {
    this.id = uuid()
    this.equation = equation
    this.createdAt = createdAt
    this.expiresAt = expiresAt
  }

  /**
   * @param {GameSettings} gameSettings
   * @param {number?} term1
   * @returns {GameQuestion}
   */
  static getRandomFromSettings(gameSettings, term1) {
    return new GameQuestion(Equation.getRandomFromSettings(gameSettings, term1, 2), Date.now(), Date.now() + gameSettings.equationDuration)
  }

  /**
   * @param {GameSettings} gameSettings
   */
  static getRandomEstimateQuestionFromSettings(gameSettings) {
    return new GameQuestion(
      Equation.getRandomFromSettings(gameSettings, undefined, gameSettings.estimateItems, [OPERATION_ADD, OPERATION_SUBTRACT]),
      Date.now(),
      Date.now() + gameSettings.equationDuration,
    )
  }

  /**
   * @param {GameSettings} gameSettings
   */
  static getRandomFractionQuestionFromSettings(gameSettings) {
    // denominator must be >= 2
    const denominator = Equation.roundIfNeeded(
      Math.max(2, gameSettings.minValue + Math.random() * (gameSettings.maxValue - gameSettings.minValue)),
      gameSettings,
    )

    // numerator must be >= 1
    const numerator = Equation.roundIfNeeded(
      Math.max(1, gameSettings.minValue + Math.random() * (denominator - gameSettings.minValue)),
      gameSettings,
    )

    return new GameQuestion(
      new Equation(new Phrase(numerator, OPERATION_DIVIDE, denominator)),
      Date.now(),
      Date.now() + gameSettings.equationDuration,
    )
  }

  /**
   * @param {GameSettings} gameSettings
   * @param {number} terms
   * @returns {GameQuestion}
   */
  static getRandomCrescendoQuestionFromSettings(gameSettings, terms) {
    return new GameQuestion(
      Equation.getRandomFromSettings(gameSettings, undefined, terms),
      Date.now(),
      Date.now() + gameSettings.crescendoRoundDuration,
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
