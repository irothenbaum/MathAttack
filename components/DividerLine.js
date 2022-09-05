import React from 'react'
import {View, StyleSheet} from 'react-native'
import {spaceDefault} from '../styles/layout'
import useColorsControl from '../hooks/useColorsControl'

function DividerLine() {
  const {shadow} = useColorsControl()
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: shadow,
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
