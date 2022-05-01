import {
  VersusSubmitAnswerEvent,
  VersusNewQuestionEvent,
  VersusReadyEvent,
  VersusEndGameEvent,
} from './versusEvents'
import {DefaultClient} from '../lib/websocket-client'

const ROOT_DOMAIN = 'https://404jkfoundit.com'

class VersusSocket extends DefaultClient {
  /** @override */
  _getConnectURL(code: string): string {
    const endpoint = code ? `/versus/${code}/join` : '/versus/create'
    return ROOT_DOMAIN.replace('http', 'ws') + endpoint
  }

  /**
   * @param {GameQuestion} q
   * @param {number} whenToShowTimestamp
   */
  broadcastNewQuestion(q, whenToShowTimestamp) {
    let eventInstance = new VersusNewQuestionEvent(q, whenToShowTimestamp)
    this.getConnection().send(eventInstance.type, eventInstance)
  }

  /**
   * @param {number} a
   */
  broadcastAnswer(a) {
    let eventInstance = new VersusSubmitAnswerEvent(a)
    this.getConnection().send(eventInstance.type, eventInstance)
  }

  broadcastReady() {
    let eventInstance = new VersusReadyEvent()
    this.getConnection().send(eventInstance.type, eventInstance)
  }

  broadcastEndGame() {
    let eventInstance = new VersusEndGameEvent()
    this.getConnection().send(eventInstance.type, eventInstance)
  }
}

export default VersusSocket
