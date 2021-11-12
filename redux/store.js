import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from 'redux'
import Settings from './SettingsSlice'
import Navigation from './NavigationSlice'

const reducer = combineReducers({
  Settings,
  Navigation,
})

const store = configureStore({
  reducer,
})

export default store
