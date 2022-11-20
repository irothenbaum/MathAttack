/**
 * @format
 */

import {AppRegistry} from 'react-native'
import App from './App'
import {name as appName} from './app.json'
import 'react-native-get-random-values'
import NotificationHelper from './lib/NotificationHelper'
import SoundHelper from './lib/SoundHelper'
import VibrateHelper from './lib/VibrateHelper'

// initialize our singletons
SoundHelper.Instance()
NotificationHelper.Instance().configure()
VibrateHelper.Instance()

AppRegistry.registerComponent(appName, () => App)
