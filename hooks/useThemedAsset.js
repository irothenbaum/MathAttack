import isDarkMode from './isDarkMode'

import darkAttackTypeform from '../assets/dark/attack_typeform.svg'
import lightAttackTypeform from '../assets/light/attack_typeform.svg'

const ASSETS = {
  'attack_typeform.svg': {
    dark: darkAttackTypeform,
    light: lightAttackTypeform,
  },
}

function useThemedAsset(fileName) {
  const isDark = isDarkMode()
  const themeStr = isDark ? 'dark' : 'light'
  const path = `../assets/${themeStr}/${fileName}`

  return {
    isDark,
    path,
    Component: ASSETS[fileName][themeStr],
  }
}

export default useThemedAsset
