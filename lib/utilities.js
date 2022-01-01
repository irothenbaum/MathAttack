/**
 * @param {number} num
 * @param {number} digits
 * @returns {string}
 */
import {spaceLarge} from '../styles/layout'

export function zeroPad(num, digits) {
  let numStr = '' + num
  let allZeros = [...new Array(digits)].map(d => '0').join('')

  return `${allZeros.substr(0, digits - numStr.length)}${numStr}`
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
