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
    this.timeToAnswerMS = timeToAnswerMS || 1 // do NOT want this value to hit 0
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
  static getQuestionComplexity(obj) {
    return Phrase.getDiscreteTerms(obj.question.equation.phrase)
      .concat(obj.answer)
      .reduce((sum, t) => {
        return sum + Math.abs(t)
      }, 0)
  }

  /**
   * @param {QuestionResult} obj
   * @returns {number}
   */
  static scoreValue(obj) {
    if (!QuestionResult.isCorrect(obj)) {
      return 0
    }

    const complexity = QuestionResult.getQuestionComplexity(obj)

    return Math.floor(
      complexity + complexity / (Math.max(1, obj.timeToAnswerMS) / 1000), // boosted by the inverse number of seconds
      // If you answer a question in 0.5 seconds, you get 3x the complexity
      // if you answer in 1 second, you get 2x the complexity.
      // if you answer it in 2 seconds you get 1.5x the complexity
      // if you answer it in 10 seconds you get 1.1x the complexity
    )
  }
}

export default QuestionResult
