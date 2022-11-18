import QuestionResult from './QuestionResult'
import Equation from './Equation'
import Phrase from './Phrase'
import {ANSWER_TIMEOUT} from '../constants/game'

class EstimationQuestionResult extends QuestionResult {
  /**
   * @param {QuestionResult} obj
   * @returns {boolean}
   */
  static isCorrect(obj) {
    return (
      !QuestionResult.isTimeout(obj) && EstimationQuestionResult.getAccuracy(obj) <= EstimationQuestionResult.getCloseEnoughThreshold(obj)
    )
  }

  /**
   * @param {QuestionResult} obj
   * @returns {boolean}
   */
  static isPerfect(obj) {
    return EstimationQuestionResult.getAccuracy(obj) === 0
  }

  /**
   * @param {QuestionResult} obj
   * @returns {boolean}
   */
  static getCloseEnoughThreshold(obj) {
    // if there are 4 terms, must be within 20, if 5 terms, within 25, etc
    return Phrase.getDiscreteTerms(obj.question.equation.phrase).length * 5
  }

  /**
   * @param {QuestionResult} obj
   * @return {number}
   */
  static getAccuracy(obj) {
    const correctAnswer = Equation.getSolution(obj.question.equation)
    return obj.answer === ANSWER_TIMEOUT ? ANSWER_TIMEOUT : Math.abs(obj.answer - correctAnswer)
  }

  /**
   * @param {QuestionResult} obj
   * @returns {number}
   */
  static scoreValue(obj) {
    if (!EstimationQuestionResult.isCorrect(obj)) {
      return 0
    }

    const complexity = QuestionResult.getQuestionComplexity(obj)
    const correctAnswer = Equation.getSolution(obj.question.equation)
    // determine how close to the correct answer we were
    const accuracy = EstimationQuestionResult.getAccuracy(obj)

    // take this as a ratio over over the correct answer
    const accuracyRatio = (correctAnswer - accuracy) / correctAnswer

    // boosted by the inverse number of seconds
    const finalValue = Math.floor((complexity * accuracyRatio) / (obj.timeToAnswerMS / 1000))

    return Math.max(finalValue, 0)
  }
}

export default EstimationQuestionResult
