import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from 'redux'
import Global from './GlobalSlice'
import Settings from './SettingsSlice'
import Navigation from './NavigationSlice'
import UI from './UISlice'
import GameClassic from './GameClassicSlice'

const reducer = combineReducers({
  Settings,
  Navigation,
  UI,
  Global,
  GameClassic,
})

const store = configureStore({
  reducer,
})

export default store
