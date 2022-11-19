import React, {useEffect} from 'react'
import {View, StatusBar, useColorScheme} from 'react-native'
import {Provider} from 'react-redux'
import store from './redux/store'
import MathAttack from './MathAttack'
import {SafeAreaProvider, SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context'

// just to speed up dev time
global.skipOnDev = true

global.hasAnimated = global.skipOnDev || false
global._SafeAreaInsets = {top: 0, bottom: 0}

function App() {
  const isDark = useColorScheme() === 'dark'

  const backgroundStyle = {
    flex: 1,
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <Provider store={store}>
          <MathAttack />
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default App
