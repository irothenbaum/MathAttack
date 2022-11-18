import store from '../redux/store'
import AsyncStore from '@react-native-async-storage/async-storage'
import {hydrateFromCache as hydrateSettings} from '../redux/SettingsSlice'
import {hydrateFromCache as hydrateScores} from '../redux/HighScoresSlice'

const CACHE_KEY = 'math-attack-app-state'

function useReduxPersist() {
  return {
    hydrate: async () => {
      const data = await AsyncStore.getItem(CACHE_KEY)
      if (data) {
        const dataParsed = JSON.parse(data)
        store.dispatch(hydrateSettings(dataParsed.Settings))
        store.dispatch(hydrateScores(dataParsed.HighScores))
      }
    },
    flush: async () => {
      const state = store.getState()
      await AsyncStore.setItem(
        CACHE_KEY,
        JSON.stringify({
          Settings: state.Settings,
          HighScores: state.HighScores,
        }),
      )
    },
  }
}

export default useReduxPersist
