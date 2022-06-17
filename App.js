import React from 'react'
import {SafeAreaView, View, StatusBar, useColorScheme} from 'react-native'
import {Provider} from 'react-redux'
import store from './redux/store'
import MathAttack from './MathAttack'
import {getBackgroundColor} from './lib/utilities'
import isDarkMode from './hooks/isDarkMode'
import {GestureHandlerRootView} from 'react-native-gesture-handler'

// just to speed up dev time
// global.hasAnimated = true

function App() {
  const isDark = isDarkMode()

  const backgroundStyle = {
    backgroundColor: getBackgroundColor(isDark),
    flex: 1,
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <GestureHandlerRootView style={backgroundStyle}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <Provider store={store}>
          <MathAttack />
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaView>
  )
}

export default App
