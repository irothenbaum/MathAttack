import React from 'react'
import {View, StatusBar, useColorScheme} from 'react-native'
import {Provider} from 'react-redux'
import store from './redux/store'
import MathAttack from './MathAttack'
import {SafeAreaProvider} from 'react-native-safe-area-context'

// just to speed up dev time
global.skipOnDev = true

global.hasAnimated = global.skipOnDev || false

function App() {
  const isDark = useColorScheme() === 'dark'

  const backgroundStyle = {
    flex: 1,
  }

  return (
    <SafeAreaProvider style={backgroundStyle}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Provider store={store}>
        <MathAttack />
      </Provider>
    </SafeAreaProvider>
  )
}

export default App
