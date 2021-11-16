import Operation from './Operation'

class Plus extends Operation {
  operate(term1, term2) {
    return term1 + term2
  }

  toString() {
    return '+'
  }
}

export default Plus
