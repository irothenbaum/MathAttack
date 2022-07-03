import {
  VersusSubmitAnswerEvent,
  VersusNewQuestionEvent,
  VersusReadyEvent,
  VersusEndGameEvent,
} from './versusEvents'
import {
  EVENT_MarkReady,
  EVENT_BroadcastNewQuestion,
  EVENT_EndGame,
  EVENT_SubmitAnswer,
} from '../constants/versus'
import {DefaultClient} from 'websocket-client'

const ROOT_DOMAIN = 'https://404jkfoundit.com'

class VersusSocket extends DefaultClient {
  /** @override */
  _getConnectURL(code) {
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

  /**
   * @param {string?} name -- the name your player has selected
   */
  broadcastReady(name) {
    let eventInstance = new VersusReadyEvent(name)
    this.getConnection().send(eventInstance.type, eventInstance)
  }

  broadcastEndGame() {
    let eventInstance = new VersusEndGameEvent()
    this.getConnection().send(eventInstance.type, eventInstance)
  }

  /** @inheritDoc */
  _generateEventFromDataMessage(dataMessage) {
    switch (dataMessage.type) {
      case EVENT_MarkReady:
        return new VersusReadyEvent(dataMessage.payload.name)

      case EVENT_BroadcastNewQuestion:
        return new VersusNewQuestionEvent(dataMessage.payload.question, dataMessage.payload.startTimestamp)

      case EVENT_SubmitAnswer:
        return new VersusSubmitAnswerEvent(dataMessage.payload.answer)

      case EVENT_EndGame:
        return new VersusEndGameEvent()
    }
  }
}

export default VersusSocket
