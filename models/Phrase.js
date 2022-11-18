export const OPERATION_ADD = '+'
export const OPERATION_SUBTRACT = '-'
export const OPERATION_MULTIPLY = '*'
export const OPERATION_DIVIDE = '/'

class Phrase {
  /**
   * @param {number|Phrase} term1
   * @param {string} operation
   * @param {number|Phrase} term2
   */
  constructor(term1, operation, term2) {
    this.term1 = term1
    this.operation = operation
    this.term2 = term2
  }

  /**
   * @param {Phrase|number} obj
   */
  static toString(obj) {
    const infixNotation = Phrase.toInfixNotation(obj)
    return infixNotation.join(' ')
  }

  /**
   * @param {Phrase|number} obj
   * @return {Array<number|string>}
   */
  static toInfixNotation(obj) {
    if (typeof obj === 'number') {
      return [obj]
    }

    return [...Phrase.toInfixNotation(obj.term1), obj.operation, ...Phrase.toInfixNotation(obj.term2)]
  }

  /**
   * @param {Phrase|number} obj
   * @returns {number}
   */
  static defineTerm(obj) {
    return typeof obj === 'number' ? obj : Phrase.getSolution(obj)
  }

  /**
   * @param {Phrase} obj
   * @return {number}
   */
  static getSolution(obj) {
    let t1Solved = Phrase.defineTerm(obj.term1)
    let t2Solved = Phrase.defineTerm(obj.term2)

    return Phrase.performOperation(t1Solved, obj.operation, t2Solved)
  }

  /**
   * @param {number} term1
   * @param {string} operation
   * @param {number} term2
   * @returns {number|*}
   */
  static performOperation(term1, operation, term2) {
    switch (operation) {
      case OPERATION_ADD:
        return term1 + term2

      case OPERATION_SUBTRACT:
        return term1 - term2

      case OPERATION_MULTIPLY:
        return term1 * term2

      case OPERATION_DIVIDE:
        return term1 / term2

      default:
        throw new Error('Unrecognized operation ' + obj.operation)
    }
  }

  /**
   * @param {Phrase|number} obj
   * @returns {Array<number>}
   */
  static getDiscreteTerms(obj) {
    if (typeof obj === 'number') {
      return [obj]
    }

    return Phrase.getDiscreteTerms(obj.term1).concat(Phrase.getDiscreteTerms(obj.term2))
  }
}

export default Phrase
