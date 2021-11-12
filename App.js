import React from 'react'
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native'
import {darkGrey, nearWhite} from './styles/colors'
import {Provider} from 'react-redux'
import store from './redux/store'
import MathAttack from './MathAttack'

function App() {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? darkGrey : nearWhite,
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Provider store={store}>
        <MathAttack />
      </Provider>
    </SafeAreaView>
  )
}

export default App
