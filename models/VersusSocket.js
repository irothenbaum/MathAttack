// TODO: Add websocket-client and extend DefaultClient object
import {} from '../constants/versus'

class VersusSocket {
  /**
   * @param {string} joinCode
   */
  constructor(joinCode) {}

  on(eventName, handler) {
    // TODO:
  }

  off(handler) {
    // TODO:
  }

  /**
   * @param {GameQuestion} q
   * @param {number} whenToShowTimestamp
   */
  broadcastNewQuestion(q, whenToShowTimestamp) {
    // TODO
  }

  /**
   * @param {number} a
   */
  broadcastAnswer(a) {
    // TODO:
  }

  markReady() {
    // TODO:
  }
}

export default VersusSocket
