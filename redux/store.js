import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from 'redux'
import Global from './GlobalSlice'
import Settings from './SettingsSlice'
import HighScores from './HighScoresSlice'
import Navigation from './NavigationSlice'
import UI from './UISlice'
import Game from './GameSlice'

const reducer = combineReducers({
  HighScores,
  Settings,
  Navigation,
  UI,
  Global,
  Game,
})

const store = configureStore({
  reducer,
})

export default store
