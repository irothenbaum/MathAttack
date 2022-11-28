import QuestionResult from './QuestionResult'
import EstimationQuestionResult from './EstimationQuestionResult'
import Equation from './Equation'
import {applyTimeBoostToScore} from '../lib/utilities'

class FractionQuestionResult extends EstimationQuestionResult {
  /**
   * @param {QuestionResult} obj
   * @returns {boolean}
   */
  static isCorrect(obj) {
    // gotta be within 20 ppt.
    return !QuestionResult.isTimeout(obj) && FractionQuestionResult.getAccuracy(obj) <= 0.2
  }

  /**
   * @param {QuestionResult} obj
   * @returns {boolean}
   */
  static isPerfect(obj) {
    return FractionQuestionResult.getAccuracy(obj) < FractionQuestionResult.PERFECT_ANSWER_THRESHOLD
  }

  /**
   * @param {QuestionResult} obj
   * @returns {number}
   */
  static scoreValue(obj) {
    if (!FractionQuestionResult.isCorrect(obj)) {
      return 0
    }

    const complexity = FractionQuestionResult.getQuestionComplexity(obj)
    const correctAnswer = Equation.getSolution(obj.question.equation)
    // determine how close to the correct answer we were
    const accuracy = FractionQuestionResult.getAccuracy(obj)

    // take this as a ratio over over the correct answer
    const accuracyRatio = (correctAnswer - accuracy) / correctAnswer

    const answerValue = complexity * accuracyRatio

    return applyTimeBoostToScore(answerValue, obj.timeToAnswerMS)
  }
}

FractionQuestionResult.PERFECT_ANSWER_THRESHOLD = 0.01

export default FractionQuestionResult
