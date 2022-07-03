import store from '../redux/store'
import AsyncStore from '@react-native-async-storage/async-storage'
import {flushFromCache} from '../redux/SettingsSlice'

const CACHE_KEY = 'math-attack-app-state'

function useReduxPersist() {
  return {
    hydrate: () => {
      AsyncStore.getItem(CACHE_KEY).then((data) => {
        if (data) {
          const dataParsed = JSON.parse(data)
          store.dispatch(flushFromCache(dataParsed.Settings))
        }
      })
    },
    flush: () => {
      const state = store.getState()
      AsyncStore.setItem(CACHE_KEY, JSON.stringify(state)).then()
    },
  }
}

export default useReduxPersist
