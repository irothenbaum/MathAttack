import React from 'react'
import {Image, View, Dimensions} from 'react-native'
import useColorsControl from '../hooks/useColorsControl'
const Logo = require('../assets/app_icon.png')

const logoDimension = Dimensions.get('window').width / 2

function LoadingSplash(props) {
  const {background} = useColorsControl()

  return (
    <View style={{height: '100%', width: '100%', backgroundColor: background, alignItems: 'center', justifyContent: 'center'}}>
      {/*<Image source={Logo} style={{width: logoDimension, height: logoDimension}} />*/}
    </View>
  )
}

export default LoadingSplash
