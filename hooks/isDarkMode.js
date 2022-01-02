import {useColorScheme} from 'react-native'

function isDarkMode() {
  return useColorScheme() === 'dark'
}

export default isDarkMode
