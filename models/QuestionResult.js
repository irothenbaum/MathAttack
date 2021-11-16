import {ANSWER_TIMEOUT} from '../constants/game'
import GameQuestion from './GameQuestion'
import Serializable from './Serializable'

class QuestionResult extends Serializable {
  /**
   * @param {GameQuestion} question
   * @param {number} answer
   */
  constructor(question, answer) {
    super()
    this.question = question
    this.answer = answer
  }

  isTimeout() {
    return this.answer === ANSWER_TIMEOUT
  }

  isCorrect() {
    return this.question.equation.getSolution() === this.answer
  }

  scoreValue() {
    if (!this.isCorrect()) {
      return 0
    }

    let baseValue =
      Math.abs(this.question.equation.term1) +
      Math.abs(this.question.equation.term2) +
      Math.abs(this.question.equation.getSolution())

    let timeBoost = 1 / (this.question.getMSRemaining() / 1000)

    return baseValue * timeBoost
  }

  /**
   * @param {{question: *, answer: number}} obj
   * @returns {QuestionResult}
   */
  static createFromPlainObject(obj) {
    return new QuestionResult(
      GameQuestion.createFromPlainObject(obj.question),
      obj.answer,
    )
  }
}

export default QuestionResult
