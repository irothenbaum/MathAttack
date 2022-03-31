// TODO: Add websocket-client and extend DefaultClient object

class VersusSocket {
  /**
   * @param {string} joinCode
   */
  constructor(joinCode) {}

  on() {}

  off() {}

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
