import React from 'react'
import {Text, StyleSheet} from 'react-native'
import {titleText} from '../styles/typography'

const styles = StyleSheet.create({
  text: {
    ...titleText,
  },
})

function TitleText(props) {
  return <Text style={styles.text}>{props.children}</Text>
}

export default TitleText
