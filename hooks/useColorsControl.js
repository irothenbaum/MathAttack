import useDarkMode from './useDarkMode'
import {
  black,
  darkGrey,
  dimmedBlue,
  dimmedGreen,
  dimmedMagenta,
  dimmedOrange,
  dimmedRed,
  dimmedYellow,
  grey,
  lightGrey,
  middleGrey,
  neonBlue,
  neonGreen,
  neonMagenta,
  neonOrange,
  neonRed,
  neonYellow,
  white,
} from '../styles/colors'
import {fadeColor} from '../lib/utilities'

/**
 * @typedef ColorScheme
 * @property {string} green
 * @property {string} blue
 * @property {string} red
 * @property {string} yellow
 * @property {string} orange
 * @property {string} magenta
 *
 * @property {string} shadowLight
 * @property {string} shadow
 * @property {string} shadowStrong
 * @property {string} sunbeamLight
 * @property {string} sunbeam
 * @property {string} sunbeamStrong
 *
 * @property {string} background
 * @property {string} backgroundTint
 * @property {string} grey
 * @property {string} foregroundTint
 * @property {string} foreground
 * @property {func} getResultColor
 */

/** @type ColorScheme */
const darkTheme = {
  green: dimmedGreen,
  blue: dimmedBlue,
  red: dimmedRed,
  yellow: dimmedYellow,
  orange: dimmedOrange,
  magenta: dimmedMagenta,
  shadowLight: fadeColor(white, 0.1),
  shadow: fadeColor(white, 0.3),
  shadowStrong: fadeColor(white, 0.6),
  sunbeamLight: fadeColor(black, 0.1),
  sunbeam: fadeColor(black, 0.3),
  sunbeamStrong: fadeColor(black, 0.6),
  background: black,
  backgroundTint: darkGrey,
  grey: grey,
  foregroundTint: middleGrey,
  foreground: lightGrey,
}

/** @type ColorScheme */
const lightTheme = {
  green: neonGreen,
  blue: neonBlue,
  red: neonRed,
  yellow: neonYellow,
  orange: neonOrange,
  magenta: neonMagenta,
  shadowLight: fadeColor(black, 0.1),
  shadow: fadeColor(black, 0.3),
  shadowStrong: fadeColor(black, 0.6),
  sunbeamLight: fadeColor(white, 0.1),
  sunbeam: fadeColor(white, 0.3),
  sunbeamStrong: fadeColor(white, 0.6),
  background: white,
  backgroundTint: lightGrey,
  grey: middleGrey,
  foregroundTint: grey,
  foreground: darkGrey,
}

/** @type ColorScheme */
const specialTheme = {
  green: '#5cc548',
  blue: neonBlue,
  red: neonRed,
  yellow: neonYellow,
  orange: neonOrange,
  magenta: neonMagenta,
  shadow: fadeColor(black, 0.3),
  shadowStrong: fadeColor(black, 0.6),
  background: '#eee7df',
  backgroundTint: lightGrey,
  grey: middleGrey,
  foregroundTint: grey,
  foreground: darkGrey,
}

/**
 * @returns {ColorScheme}
 */
function useColorsControl() {
  const isDark = useDarkMode()

  const theme = isDark ? darkTheme : lightTheme
  // const theme = specialTheme
  // const theme = lightTheme

  return {
    ...theme,
    getResultColor: (isCorrect) => (isCorrect ? theme.green : theme.red),
  }
}

export default useColorsControl
