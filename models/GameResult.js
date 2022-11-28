import {Scene_GameEstimate, Scene_GameFractions} from '../constants/scenes'
import EstimationQuestionResult from './EstimationQuestionResult'
import QuestionResult from './QuestionResult'
import {v4 as uuid} from 'uuid'
import FractionQuestionResult from './FractionQuestionResult'

/**
 * @param {string} game
 * @returns {EstimationQuestionResult|QuestionResult}
 */
export function getQuestionRequestClassForGame(game) {
  return game === Scene_GameEstimate ? EstimationQuestionResult : game === Scene_GameFractions ? FractionQuestionResult : QuestionResult
}

class GameResult {
  /**
   * @param {String} game
   * @param {Array<QuestionResult>} questionResults
   * @param {string?} playerName
   */
  constructor(game, questionResults, playerName) {
    this.id = uuid()
    this.game = game
    this.questionResults = questionResults
    this.playerName = playerName
    this.dateCreated = new Date().toISOString()

    const QuestionResultClass = getQuestionRequestClassForGame(game)
    this.finalScore = questionResults.reduce((total, r) => {
      return total + QuestionResultClass.scoreValue(r)
    }, 0)
  }
}

export default GameResult
