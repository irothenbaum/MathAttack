import {useColorScheme} from 'react-native'
import {useSelector} from 'react-redux'
import {COLOR_SCHEME_DARK} from '../constants/game'

function useDarkMode() {
  const override = useSelector((state) => state.Settings.colorScheme)
  const colorSchemeIsDark = useColorScheme() === 'dark'
  return override ? override === COLOR_SCHEME_DARK : colorSchemeIsDark
}

export default useDarkMode
