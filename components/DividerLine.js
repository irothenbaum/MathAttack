import React from 'react'
import {View, StyleSheet} from 'react-native'
import useDarkMode from '../hooks/useDarkMode'
import {shadow, sunbeam} from '../styles/colors'
import {spaceDefault} from '../styles/layout'

function DividerLine() {
  const isDark = useDarkMode()
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: isDark ? sunbeam : shadow,
        },
      ]}
    />
  )
}
const styles = StyleSheet.create({
  divider: {
    marginVertical: spaceDefault,
    width: '100%',
    height: 1,
  },
})

export default DividerLine
