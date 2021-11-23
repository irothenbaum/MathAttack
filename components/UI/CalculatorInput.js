import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import CalculatorButton, {CLEAR, DECIMAL} from './CalculatorButton'
import {RoundBox} from '../../styles/elements'
import {useSelector} from 'react-redux'
import {selectUserInput} from '../../redux/selectors'
import {spaceExtraLarge, spaceExtraSmall} from '../../styles/layout'
import {font4} from '../../styles/typography'
import {darkGrey} from '../../styles/colors'

function CalculatorInput(props) {
  const userInput = useSelector(selectUserInput)

  return (
    <View style={styles.container}>
      <View style={styles.answerBar}>
        <Text style={styles.answerText}>{userInput}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.calculatorRow}>
          <CalculatorButton style={styles.calculatorButton} value={7} />
          <CalculatorButton style={styles.calculatorButton} value={8} />
          <CalculatorButton style={styles.calculatorButton} value={9} />
        </View>
        <View style={styles.calculatorRow}>
          <CalculatorButton style={styles.calculatorButton} value={4} />
          <CalculatorButton style={styles.calculatorButton} value={5} />
          <CalculatorButton style={styles.calculatorButton} value={6} />
        </View>
        <View style={styles.calculatorRow}>
          <CalculatorButton style={styles.calculatorButton} value={1} />
          <CalculatorButton style={styles.calculatorButton} value={2} />
          <CalculatorButton style={styles.calculatorButton} value={3} />
        </View>
        <View style={styles.calculatorRow}>
          <CalculatorButton style={styles.calculatorButton} value={CLEAR} />
          <CalculatorButton style={styles.calculatorButton} value={0} />
          <CalculatorButton style={styles.calculatorButton} value={DECIMAL} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  answerBar: {
    ...RoundBox,
    paddingRight: spaceExtraLarge,
  },
  answerText: {
    fontSize: font4,
    color: darkGrey,
    width: '100%',
    textAlign: 'right',
  },
  calculatorButton: {
    flex: 1,
    height: '100%',
    width: '100%',
    margin: spaceExtraSmall,
  },
  buttonsContainer: {
    margin: spaceExtraSmall,
    width: '100%',
    flex: 1,
  },
  calculatorRow: {
    margin: spaceExtraSmall,
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default CalculatorInput
