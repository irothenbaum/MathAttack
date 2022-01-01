import {ANSWER_TIMEOUT} from '../constants/game'
import GameQuestion from './GameQuestion'
import Equation from './Equation'

class QuestionResult {
  /**
   * @param {GameQuestion} question
   * @param {number} answer
   */
  constructor(question, answer) {
    this.question = question
    this.answer = answer
  }

  /**
   * @param {QuestionResult} obj
   * @returns {boolean}
   */
  static isTimeout(obj) {
    return obj.answer === ANSWER_TIMEOUT
  }

  /**
   * @param {QuestionResult} obj
   * @returns {boolean}
   */
  static isCorrect(obj) {
    let correctAnswer = Equation.getSolution(obj.question.equation)
    return correctAnswer === obj.answer
  }

  /**
   * @param {QuestionResult} obj
   * @returns {number}
   */
  static scoreValue(obj) {
    if (!QuestionResult.isCorrect(obj)) {
      return 0
    }

    let baseValue =
      Math.abs(obj.question.equation.term1) +
      Math.abs(obj.question.equation.term2) +
      Math.abs(Equation.getSolution(obj.question.equation))

    let timeBoost = 1 / (GameQuestion.getMSRemaining(obj.question) / 1000)

    return baseValue * timeBoost
  }
}

export default QuestionResult
