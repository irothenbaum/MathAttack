import React from 'react'
import {SafeAreaView, View, StatusBar, useColorScheme} from 'react-native'
import {Provider} from 'react-redux'
import store from './redux/store'
import MathAttack from './MathAttack'
import {getBackgroundColor} from './lib/utilities'
import isDarkMode from './hooks/isDarkMode'

function App() {
  const isDark = isDarkMode()

  const backgroundStyle = {
    backgroundColor: getBackgroundColor(isDark),
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Provider store={store}>
        <MathAttack />
      </Provider>
    </SafeAreaView>
  )
}

export default App
