import {ANSWER_TIMEOUT} from '../constants/game'
import Equation from './Equation'

class QuestionResult {
  /**
   * @param {GameQuestion} question
   * @param {number} answer
   */
  constructor(question, answer) {
    this.question = question
    this.answer = answer
    this.createdAt = Date.now()
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

    return (
      Math.abs(obj.question.equation.term1) +
      Math.abs(obj.question.equation.term2) +
      Math.abs(obj.answer)
    )
  }
}

export default QuestionResult
