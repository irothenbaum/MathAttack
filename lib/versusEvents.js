import {Event} from 'websocket-client'
import {EVENT_MarkReady, EVENT_BroadcastNewQuestion, EVENT_EndGame, EVENT_SubmitAnswer} from '../constants/versus'

export class VersusNewQuestionEvent extends Event {
  /**
   * @param {GameQuestion} question
   * @param {number} startTimestamp
   */
  constructor(question, startTimestamp) {
    super(EVENT_BroadcastNewQuestion)

    this.question = question
    this.startTimestamp = startTimestamp
  }
}

export class VersusReadyEvent extends Event {
  /**
   * @param {string} name
   */
  constructor(name) {
    super(EVENT_MarkReady)
    this.name = name
  }
}

export class VersusSubmitAnswerEvent extends Event {
  /**
   * @param {number} answer
   */
  constructor(answer) {
    super(EVENT_SubmitAnswer)
    this.answer = answer
  }
}

export class VersusEndGameEvent extends Event {
  constructor() {
    super(EVENT_EndGame)
  }
}
