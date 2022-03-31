import React, {useState, useRef, useEffect, useCallback} from 'react'
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import TitleText from '../components/TitleText'
import InGameMenu from '../components/InGameMenu'
import {ScreenContainer} from '../styles/elements'

function GameEstimate() {
  return (
    <View style={styles.window}>
      <InGameMenu />
      <TitleText>Coming Soon</TitleText>
    </View>
  )
}

const styles = StyleSheet.create({
  window: {...ScreenContainer},
})

export default GameEstimate
