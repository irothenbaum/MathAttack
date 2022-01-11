import {ANSWER_TIMEOUT} from '../constants/game'
import Equation from './Equation'
import Phrase from './Phrase'

class QuestionResult {
  /**
   * @param {GameQuestion} question
   * @param {number} answer
   * @param {number} timeToAnswerMS
   */
  constructor(question, answer, timeToAnswerMS) {
    this.question = question
    this.answer = answer
    this.timeToAnswerMS = timeToAnswerMS
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

    return Math.floor(
      Phrase.getDiscreteTerms(obj.question.equation.phrase)
        .concat(obj.answer)
        .reduce((sum, t) => {
          return sum + Math.abs(t)
        }, 0) /
        (obj.timeToAnswerMS / 1000), // boosted by the inverse number of seconds
    )
  }
}

export default QuestionResult
