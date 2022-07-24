import Phrase, {OPERATION_SUBTRACT, OPERATION_ADD, OPERATION_DIVIDE, OPERATION_MULTIPLY} from './Phrase'
import PhraseBuffer from './PhraseBuffer'

/**
 * @param {number} value
 * @param {GameSettings} gameSettings
 * @returns {number}
 */
function roundIfNeeded(value, gameSettings) {
  let decimalBase = Math.round(Math.pow(10, gameSettings.decimalPlaces))
  return Math.round(value * decimalBase) / decimalBase
}

/**
 * @param {number} value
 * @param {GameSettings} gameSettings
 * @param {boolean} ignoreOneAndSelf
 */
function getFactors(value, gameSettings, ignoreOneAndSelf) {
  const decimalScale = Math.pow(10, gameSettings.decimalPlaces)
  let numberWithoutDecimals = value * decimalScale

  // we can find all factors for a number checking only those up to the square root of that number
  return (
    [...new Array(parseInt(Math.sqrt(numberWithoutDecimals)))]
      .map((e, i) => i + 1)
      .filter((n) => (ignoreOneAndSelf ? n > 1 : true))
      .reduce((agr, n) => {
        // if this number evenly divides our starting value, add it and the divisor to our factors list
        if (numberWithoutDecimals % n === 0) {
          agr.splice(agr.length / 2, 0, n, numberWithoutDecimals / n)
        }
        return agr
      }, [])
      // scale back accounting for decimal settings
      .map((n) => n / decimalScale)
  )
}

/**
 * @param {number} answer
 * @param {number} otherTerm
 * @param {number} termRange
 * @param {GameSettings} gameSettings
 * @param {Array<string>} possibleOperations
 * @return {[number, string]}
 */
function selectNextTerm(answer, otherTerm, termRange, gameSettings, possibleOperations) {
  let thisTerm
  let operation

  let possibleFactors
  const canUseDivision =
    possibleOperations.includes(OPERATION_DIVIDE) &&
    otherTerm > gameSettings.maxValue / 2 &&
    (possibleFactors = getFactors(otherTerm, gameSettings, true)).length
  const canUseMultiplication = possibleOperations.includes(OPERATION_MULTIPLY) && otherTerm < gameSettings.maxValue / 5 && otherTerm > 0
  const useSimpleOperation = Math.round(Math.random() * 2) === 0

  if (canUseDivision && !useSimpleOperation) {
    // select a random factor
    thisTerm = possibleFactors[parseInt(Math.random() * possibleFactors.length)]
    operation = OPERATION_DIVIDE
  } else if (canUseMultiplication && !useSimpleOperation) {
    do {
      thisTerm = Math.ceil(Math.random() * ((gameSettings.maxValue * 1.2) / otherTerm))
    } while (thisTerm <= 1)
    operation = OPERATION_MULTIPLY
  } else {
    do {
      // determine the value for this term
      const termVal = gameSettings.allowNegative
        ? termRange - Math.random() * 1.5 * termRange
        : gameSettings.minValue + Math.random() * termRange
      thisTerm = roundIfNeeded(termVal, gameSettings)
    } while (thisTerm === 0 || thisTerm === answer)

    if (thisTerm < 0) {
      thisTerm = Math.abs(thisTerm)
      operation = OPERATION_SUBTRACT
    } else {
      operation = OPERATION_ADD
    }
  }

  return [thisTerm, operation]
}

/**
 * @param {number} answer
 * @param {number} otherTerm
 * @param {GameSettings} gameSettings
 * @param {Array<string>} possibleOperations
 * @return {[number, string]}
 */
function findFinalTerm(answer, otherTerm, gameSettings, possibleOperations) {
  if (answer === otherTerm) {
    return [0, OPERATION_ADD]
  } else if (answer > otherTerm) {
    if (possibleOperations.includes(OPERATION_MULTIPLY)) {
      const answerFactors = getFactors(answer, gameSettings, true)
      if (answerFactors.includes(otherTerm)) {
        return [answer / otherTerm, OPERATION_MULTIPLY]
      }
    }
    return [answer - otherTerm, OPERATION_ADD]
  } else {
    if (possibleOperations.includes(OPERATION_DIVIDE)) {
      const otherFactors = getFactors(answer, gameSettings, true)
      if (otherFactors.includes(answer)) {
        return [otherTerm / answer, OPERATION_DIVIDE]
      }
    }
    return [otherTerm - answer, OPERATION_SUBTRACT]
  }
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
   * @param {GameSettings} gameSettings
   * @param {number|Phrase?} firstTerm
   * @param {number} totalTerms
   * @param {Array<string>?} possibleOperations
   * @returns {Equation}
   */
  static getRandomFromSettings(
    gameSettings,
    firstTerm,
    totalTerms = 2,
    // TODO: cannot currently turn off add or subtract. But can turn off multiply / divide by not including them in the array
    possibleOperations = [OPERATION_ADD, OPERATION_SUBTRACT, OPERATION_MULTIPLY, OPERATION_DIVIDE],
  ) {
    const phraseBuffer = new PhraseBuffer()
    let term1 = typeof firstTerm === 'number' ? firstTerm : typeof firstTerm === 'object' ? Phrase.getSolution(firstTerm) : undefined
    if (typeof term1 === 'number') {
      phraseBuffer.addTerm(term1)
    }

    let answer
    let answerRange = gameSettings.maxValue - gameSettings.minValue
    // if we're using a lot of numbers we apply a small scale to keep the values manageable
    const termRange = answerRange / Math.min(totalTerms - 1, 4)

    // we select the answer randomly from our answerRange
    do {
      answer = roundIfNeeded(gameSettings.minValue + Math.random() * answerRange, gameSettings)
    } while (answer === term1)

    // next we continue to select random terms until we've reached n-1 terms
    let runningTotal = term1 || 0
    while (phraseBuffer.getTotalTerms() < totalTerms - 1) {
      // select the next term and operation
      let [newTerm, operation] = selectNextTerm(answer, runningTotal, termRange, gameSettings, possibleOperations)

      phraseBuffer.addTerm(newTerm, operation)
      runningTotal = Phrase.performOperation(runningTotal, operation, newTerm)
    }

    const [finalTerm, finalOperation] = findFinalTerm(answer, runningTotal, gameSettings, possibleOperations)
    phraseBuffer.addTerm(finalTerm, finalOperation)

    return new Equation(phraseBuffer.toPhrase())
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
