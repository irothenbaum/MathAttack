import React from 'react'
import {View, StyleSheet} from 'react-native'
import resultStyles from './sharedStyles'
import NormalText from '../NormalText'
import {font2} from '../../styles/typography'
import {spaceDefault} from '../../styles/layout'
import useColorsControl from '../../hooks/useColorsControl'

function DefaultResultsHeader() {
  const {shadowLight} = useColorsControl()

  return (
    <View style={[styles.headerContainer, {backgroundColor: shadowLight}]}>
      <View style={resultStyles.singleResultEquation}>
        <NormalText style={styles.headerText}>Question</NormalText>
      </View>
      <View style={resultStyles.singleResultEquals}>
        <NormalText style={styles.headerText} />
      </View>
      <View style={resultStyles.singleResultAnswer}>
        <NormalText style={styles.headerText}>Answer</NormalText>
      </View>
      <View style={resultStyles.singleResultScore}>
        <NormalText style={styles.headerText}>Score</NormalText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    padding: spaceDefault,
  },

  headerText: {
    fontWeight: 'bold',
    fontSize: font2,
    textAlign: 'center',
  },
})

export default DefaultResultsHeader
