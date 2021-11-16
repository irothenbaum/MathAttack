import Serializable from './Serializable'

class Operation extends Serializable {
  /**
   * @param {number} term1
   * @param {number} term2
   * @returns {number}
   */
  operate(term1, term2) {
    throw new Error('Must be overridden')
  }

  toPlainObject() {
    return this.toString()
  }
}

export default Operation
