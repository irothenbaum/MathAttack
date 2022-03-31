import React from 'react'
import {StyleSheet, View} from 'react-native'
import {ScreenContainer} from '../../styles/elements'
import TitleText from '../../components/TitleText'

function ResultsAndPlayAgain(props) {
  return (
    <View style={styles.window}>
      <TitleText>Game Over</TitleText>
    </View>
  )
}

const styles = StyleSheet.create({
  window: {...ScreenContainer},
})

export default ResultsAndPlayAgain
