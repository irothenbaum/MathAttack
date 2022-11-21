import {spaceDefault, spaceLarge, spaceSmall} from '../styles/layout'
import {black, darkGrey, DimmedColors, dimmedGreen, dimmedRed, lightGrey, NeonColors, neonGreen, neonRed, white} from '../styles/colors'

/**
 * @param {number} num
 * @param {number} digits
 * @returns {string}
 */
export function zeroPad(num, digits) {
  let numStr = '' + num
  let allZeros = [...new Array(digits)].map((d) => '0').join('')

  return `${allZeros.substr(0, digits - numStr.length)}${numStr}`
}

/**
 * @param {boolean} isDark
 * @returns {*}
 */
export function getRandomTintColor(isDark) {
  let options = isDark ? DimmedColors : NeonColors

  return selectRandom(options)
}

/**
 * @param {number?} startOffset
 * @param {number?} endOffset
 * @param {number?} sliceCount
 * @return {{outputRange: [number], inputRange: [number]}}
 */
const generateRandomVibratePattern = (startOffset, endOffset, sliceCount, shiftAmount = spaceLarge) => {
  const hasOffset = typeof startOffset === 'number' || typeof endOffset === 'number'

  startOffset = startOffset || 0
  endOffset = endOffset || 1

  const offsetScale = endOffset - startOffset
  const numberOfSlices = sliceCount || Math.ceil(50 * offsetScale)

  let inputs = [0]
  let outputs = [0]

  for (let i = 1; i < numberOfSlices; i++) {
    // the inputs will be from [0 -> 1)
    inputs.push(i / numberOfSlices)
    outputs.push((Math.random() - 0.5) * shiftAmount)
  }

  // we then animated back to 0 for the last slice
  inputs.push(1)
  outputs.push(0)

  if (hasOffset) {
    // if our inputs are [0, 0.25, 0.5, 1]
    // and startOffset is 0.75
    // then we transform our inputs to [0.75, 0.8125, 0.875, 1]
    inputs = inputs.map((i) => startOffset + i * offsetScale)
  }

  // we then apply some extra padding in case of any offset
  inputs.push(1)
  outputs.push(0)
  inputs.unshift(0)
  outputs.unshift(0)

  return {
    inputRange: inputs,
    outputRange: outputs,
  }
}

/**
 * @param {*} animation
 * @param {number?} startOffset
 * @param {number?} endOffset
 * @returns {{marginLeft: *, marginRight: *}}
 */
export function getVibrateStylesForAnimation(animation, startOffset, endOffset) {
  return {
    marginLeft: animation.interpolate(generateRandomVibratePattern(startOffset, endOffset)),
    marginTop: animation.interpolate(generateRandomVibratePattern(startOffset, endOffset)),
  }
}

/**
 * @param {*} animation
 * @param {number} startOffset
 * @param {number} endOffset
 * @returns {*}
 */
export function getOutOfFocusStylesForAnimation(animation, startOffset, endOffset, shiftAmount = spaceDefault) {
  return {
    top: animation.interpolate(generateRandomVibratePattern(startOffset, endOffset, 4, shiftAmount)),
    left: animation.interpolate(generateRandomVibratePattern(startOffset, endOffset, 4, shiftAmount)),
  }
}

const flashes = 16
const stepSize = 1 / flashes
const arr = [...new Array(flashes)]
const input = arr.map((e, i) => (i % 2 === 1 ? i * stepSize : Math.max(0, i - 1) * stepSize + 0.001))
const output = arr.map((e, i) => Math.floor(i / 2) % 2)
/**
 * @param {*} animation
 * @returns {*}
 */
export function getFlashStylesForAnimation(animation) {
  return {
    opacity: animation.interpolate({
      inputRange: [0, ...input, 1],
      outputRange: [1, ...output, 0],
    }),
  }
}

/**
 * @return {string}
 */
export function getRandomString() {
  return Math.random().toString(36).substr(2)
}

/**
 * @param {*} obj
 * @returns {*}
 */
export function serializeObject(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * @param {boolean} isDark
 * @returns {string}
 */
export function getBackgroundColor(isDark) {
  return isDark ? black : white
}

/**
 * @param {boolean} isDark
 * @returns {string}
 */
export function getUIColor(isDark) {
  return isDark ? lightGrey : darkGrey
}

/**
 * @param {number} number
 * @param {number} decimalPlaces
 */
export function formatNumber(number, decimalPlaces = 0) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * @param {boolean} isCorrect
 * @param {boolean} isDark
 * @return {string}
 */
export function getResultColor(isCorrect, isDark) {
  return isCorrect ? (isDark ? dimmedGreen : neonGreen) : isDark ? dimmedRed : neonRed
}

/**
 * @param {string} char
 * @returns {number}
 */
export function hexToDec(char) {
  if (typeof char === 'number') {
    return char
  }

  if (char.length === 1) {
    const parsed = parseInt(char)
    if (isNaN(parsed)) {
      // a = 97, b = 98, etc... so we subtract 87 so a = 10, b = 11, etc
      const v = char.toLowerCase().charCodeAt(0) - 87
      if (v > 15) {
        throw new Error('Invalid hex character ' + char)
      }
      return v
    } else {
      return parsed
    }
  } else {
    return [...char].reverse().reduce((agr, c, index) => agr + Math.pow(16, index) * hexToDec(c), 0)
  }
}

/**
 * @param {string} color
 * @param {number} opacity
 * @returns {string}
 */
const calculateFadedColor = (color, opacity) => {
  if (color[0] === '#') {
    const r = hexToDec(color.substr(1, 2))
    const g = hexToDec(color.substr(3, 2))
    const b = hexToDec(color.substr(5, 2))

    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  } else {
    throw new Error('Cannot fade non-hex color')
  }
}

const colorCache = {}
/**
 * @param {string} color
 * @param {number} opacity
 * @returns {string}
 */
export function fadeColor(color, opacity) {
  const key = `${color}--${opacity}`
  if (!colorCache[key]) {
    colorCache[key] = calculateFadedColor(color, opacity)
  }
  return colorCache[key]
}

/**
 * @param {*} e
 * @returns {Promise<{x: number, y: number}>}
 */
export function getScreenPositionFromLayoutEvent(e) {
  return new Promise((resolve, reject) => {
    e.target.measure((x, y, width, height, pageX, pageY) => {
      resolve({
        x: x + pageX + width / 2,
        y: y + (pageY - global._SafeAreaInsets.top) + height / 2,
      })
    })
  })
}

/**
 * @param {string} str
 * @returns {{term: number, operation: string}}
 */
export function termStrToTerm(str) {
  const parts = str.split(':')
  return {operation: parts[0], term: parseFloat(parts[1])}
}

/**
 * @param {number | Array<*>} arr
 * @returns {*}
 */
export function selectRandom(arr) {
  if (Array.isArray(arr)) {
    return arr[Math.floor(Math.random() * arr.length)]
  } else if (typeof arr === 'number') {
    return Math.floor(Math.random() * arr)
  }
  throw new Error('Cannot select random of input ' + arr)
}
