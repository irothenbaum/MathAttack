import React from 'react'
import {Text} from 'react-native'
import fontStyles from '../styles/typography'

function TitleText(props) {
  return <Text style={fontStyles.titleText}>{props.children}</Text>
}

export default TitleText
