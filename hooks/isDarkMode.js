import {useColorScheme} from 'react-native'

function isDarkMode() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return false // useColorScheme() === 'dark'
}

export default isDarkMode
