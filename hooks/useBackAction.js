import {BackHandler} from 'react-native'
import {useEffect} from 'react'

function useBackAction(onBack) {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBack)

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBack)
    }
  }, [onBack])
}

export default useBackAction
