import Phrase from './Phrase'
import {floatFix} from '../lib/utilities'

class PhraseBuffer {
  constructor() {
    this.term1 = undefined
    this.operation = undefined
    this.term2 = undefined
  }

  /**
   * @param {number|Phrase} term
   * @param {string?} operation
   */
  addTerm(term, operation) {
    if (typeof this.term1 !== 'number') {
      // we ignore the operation
      this.term1 = floatFix(term)
      return
    }

    if (!operation) {
      throw new Error('Must include an operation to add a second term')
    }

    // if we already have a term 2, we convert our term1, operation, and term2 into a single phrase as term1
    // then set this term2
    if (typeof this.term2 === 'number') {
      this.term1 = this.toPhrase()
    }

    this.operation = operation
    this.term2 = floatFix(term)
  }

  /**
   * @returns {Phrase}
   */
  toPhrase() {
    if (typeof this.term1 !== 'number' || !this.operation || typeof this.term2 !== 'number') {
      const e = new Error('Cannot construct a phrase')
      console.error(e)
      throw e
    }
    return new Phrase(this.term1, this.operation, this.term2)
  }

  /**
   * @returns {number}
   */
  getTotalTerms() {
    let count = 0
    if (typeof this.term1 === 'number') {
      count++
    } else if (typeof this.term1 === 'object') {
      count += Phrase.getDiscreteTerms(this.term1).length
    }

    if (typeof this.term2 === 'number') {
      count++
    } else if (typeof this.term2 === 'object') {
      count += Phrase.getDiscreteTerms(this.term2).length
    }

    return count
  }
}

export default PhraseBuffer
