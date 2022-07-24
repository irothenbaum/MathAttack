import Phrase, {OPERATION_ADD} from './Phrase'

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
    if (!this.term1) {
      if (operation && operation !== OPERATION_ADD) {
        throw new Error('First term must be treated as addition to 0')
      }
      this.term1 = term
      return
    }

    if (!operation) {
      throw new Error('Must include an operation to add a second term')
    }

    // if we already have a term 2, we convert our term1, operation, and term2 into a single phrase as term1
    // then set this term2
    if (this.term2) {
      this.term1 = this.toPhrase()
    }

    this.operation = operation
    this.term2 = term
  }

  /**
   * @returns {Phrase}
   */
  toPhrase() {
    if (!this.term1 || !this.operation || !this.term2) {
      throw new Error('Cannot construct a phrase')
    }
    return new Phrase(this.term1, this.operation, this.term2)
  }

  /**
   * @returns {number}
   */
  getTotalTerms() {
    let count = 0
    if (typeof this.term2 === 'number') {
      count++
    }

    if (typeof this.term1 === 'number') {
      count++
    } else if (typeof this.term1 === 'object') {
      count += Phrase.getDiscreteTerms(this.term1).length
    }

    return count
  }
}

export default PhraseBuffer
