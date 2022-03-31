import React from 'react'
import {View, StyleSheet} from 'react-native'
import isDarkMode from '../hooks/isDarkMode'
import {shadow, sunbeam} from '../styles/colors'

function DividerLine() {
  return <View style={styles.divider} />
}
const styles = StyleSheet.create({
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: isDarkMode() ? sunbeam : shadow,
  },
})

export default DividerLine
