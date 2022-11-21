import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from 'redux'
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
  Game,
})

const store = configureStore({
  reducer,
})

export default store
