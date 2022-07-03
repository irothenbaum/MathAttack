import Phrase, {OPERATION_SUBTRACT, OPERATION_ADD} from './Phrase'

function roundIfNeeded(value, decimalPlaces) {
  let decimalBase = Math.round(Math.pow(10, decimalPlaces))
  return Math.round(value * decimalBase) / decimalBase
}

class Equation {
  /**
   * @param {Phrase} phrase
   */
  constructor(phrase) {
    this.phrase = phrase
  }

  /**
   * Allow Negative doesn't work exactly right...
   * @param {GameSettings} GameSettings
   * @param {number|Phrase?} firstTerm
   * @param {number} totalTerms
   * @returns {Equation}
   */
  static getRandomFromSettings(GameSettings, firstTerm, totalTerms = 2) {
    let term1 = typeof firstTerm === 'number' ? firstTerm : typeof firstTerm === 'object' ? Phrase.getSolution(firstTerm) : undefined
    const term1IsSet = typeof term1 === 'number'
    const terms = term1IsSet ? [term1] : []

    let answer
    let answerRange = GameSettings.maxValue - GameSettings.minValue
    do {
      // we selected the answer randomly from our answerRange
      answer = roundIfNeeded(GameSettings.minValue + Math.random() * answerRange, GameSettings.decimalPlaces)
    } while (answer === terms[0])

    let runningTotal = term1 || 0

    // if we're using a lot of numbers we apply a small scale to keep the values manageable
    let termRange = answerRange / Math.min(totalTerms - 1, 4)
    for (let i = terms.length; i < totalTerms - 1; i++) {
      let thisTerm

      do {
        // determine the value for this term
        const termVal = GameSettings.allowNegative
          ? termRange - Math.random() * 1.5 * termRange
          : GameSettings.minValue + Math.random() * termRange
        thisTerm = roundIfNeeded(termVal, GameSettings.decimalPlaces)
      } while (thisTerm === 0 || thisTerm === answer)

      // update our running total and record the term to our list
      runningTotal += thisTerm
      terms.push(thisTerm)
    }

    // the last term must get us back to the predetermined ansewr value
    let finalTerm = roundIfNeeded(answer - runningTotal, GameSettings.decimalPlaces)
    terms.push(finalTerm)

    // now shuffle the last term because sometimes the finalTerm tends to be larger than the others
    // NOTE: If term 1 is set, it cannot be the candidate swap Index
    let swapIndex = term1IsSet ? 1 + Math.floor(Math.random() * (terms.length - 1)) : Math.floor(Math.random() * terms.length)
    let temp = terms[swapIndex]
    terms[swapIndex] = terms[terms.length - 1]
    terms[terms.length - 1] = temp

    // now build out phrase from the array of terms
    const phrase = terms.slice(1).reduce((agr, t) => {
      let operation
      if (t > 0) {
        operation = OPERATION_ADD
      } else {
        operation = OPERATION_SUBTRACT
        t = Math.abs(t)
      }
      return new Phrase(agr, operation, t)
    }, terms[0])

    return new Equation(phrase)
  }

  /**
   * @param {Equation} obj
   * @returns {string}
   */
  static getLeftSide(obj) {
    return Phrase.toString(obj.phrase)
  }

  /**
   * @param {Equation} obj
   * @returns {Array<string|number>}
   */
  static getLeftSideInfixNotation(obj) {
    return Phrase.toInfixNotation(obj.phrase)
  }

  /**
   * @param {Equation} obj
   */
  static getSolution(obj) {
    return Phrase.getSolution(obj.phrase)
  }
}

export default Equation

/*


 0              20
 | ------------ |

A = 17
0              20
 | ---------A-- |

 */
