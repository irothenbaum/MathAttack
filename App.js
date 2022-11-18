import React from 'react'
import {SafeAreaView, View, StatusBar, useColorScheme} from 'react-native'
import {Provider} from 'react-redux'
import store from './redux/store'
import MathAttack from './MathAttack'

// just to speed up dev time
global.skipOnDev = true

global.hasAnimated = global.skipOnDev || false

function App() {
  const isDark = useColorScheme() === 'dark'

  const backgroundStyle = {
    flex: 1,
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
