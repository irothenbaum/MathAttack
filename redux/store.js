import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from 'redux'
import Settings from './SettingsSlice'
import Navigation from './NavigationSlice'
import UI from './UISlice'
import GameClassic from './GameClassicSlice'

const reducer = combineReducers({
  Settings,
  Navigation,
  UI,
  GameClassic,
})

const store = configureStore({
  reducer,
})

export default store
