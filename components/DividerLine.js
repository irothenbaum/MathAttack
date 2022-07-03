import React from 'react'
import {View, StyleSheet} from 'react-native'
import isDarkMode from '../hooks/isDarkMode'
import {shadow, sunbeam} from '../styles/colors'
import {spaceDefault} from '../styles/layout'

function DividerLine() {
  return <View style={styles.divider} />
}
const styles = StyleSheet.create({
  divider: {
    marginVertical: spaceDefault,
    width: '100%',
    height: 1,
    backgroundColor: isDarkMode() ? sunbeam : shadow,
  },
})

export default DividerLine
