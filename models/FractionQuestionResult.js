import QuestionResult from './QuestionResult'
import EstimationQuestionResult from './EstimationQuestionResult'

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
    return EstimationQuestionResult.getAccuracy(obj) < FractionQuestionResult.PERFECT_ANSWER_THRESHOLD
  }
}

FractionQuestionResult.PERFECT_ANSWER_THRESHOLD = 0.01

export default FractionQuestionResult
