/**
 * @param {number} num
 * @param {number} digits
 * @returns {string}
 */
import {spaceLarge} from '../styles/layout'
import {
  black,
  darkGrey,
  DimmedColors,
  lightGrey,
  NeonColors,
  white,
} from '../styles/colors'

export function zeroPad(num, digits) {
  let numStr = '' + num
  let allZeros = [...new Array(digits)].map(d => '0').join('')

  return `${allZeros.substr(0, digits - numStr.length)}${numStr}`
}

/**
 * @param {boolean} isDark
 * @returns {*}
 */
export function getRandomTintColor(isDark) {
  let options = isDark ? DimmedColors : NeonColors

  return options[Math.floor(Math.random() * options.length)]
}

/**
 * @param {*} animation
 * @returns {*}
 */
export function getVibrateStylesForAnimation(animation) {
  const generateRandomVibratePattern = (numberOfSlices = 20) => {
    let inputs = []
    let outputs = []
    // the 11 comes from the animation range (0->1) divided into tenths
    // 0, 0.1, 0.2
    for (let i = 0; i < numberOfSlices + 1; i++) {
      inputs.push(i / (4 * numberOfSlices))
      outputs.push((Math.random() - 0.5) * spaceLarge)
    }
    inputs.push(0.5)
    outputs.push(0)
    inputs.push(1)
    outputs.push(0)

    return {
      inputRange: inputs,
      outputRange: outputs,
    }
  }

  return {
    marginLeft: animation.interpolate(generateRandomVibratePattern()),
    marginTop: animation.interpolate(generateRandomVibratePattern()),
  }
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
