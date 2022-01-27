import React from 'react'
import {View, StyleSheet} from 'react-native'
import CalculatorButton, {CLEAR, DECIMAL} from './CalculatorButton'
import PropTypes from 'prop-types'

function CalculatorInput(props) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <View style={styles.calculatorRow}>
          <CalculatorButton
            isDisabled={props.isDisabled}
            style={styles.calculatorButton}
            value={1}
          />
          <CalculatorButton
            isDisabled={props.isDisabled}
            style={styles.calculatorButton}
            value={2}
          />
          <CalculatorButton
            isDisabled={props.isDisabled}
            style={styles.calculatorButton}
            value={3}
          />
        </View>
        <View style={styles.calculatorRow}>
          <CalculatorButton
            isDisabled={props.isDisabled}
            style={styles.calculatorButton}
            value={4}
          />
          <CalculatorButton
            isDisabled={props.isDisabled}
            style={styles.calculatorButton}
            value={5}
          />
          <CalculatorButton
            isDisabled={props.isDisabled}
            style={styles.calculatorButton}
            value={6}
          />
        </View>
        <View style={styles.calculatorRow}>
          <CalculatorButton
            isDisabled={props.isDisabled}
            style={styles.calculatorButton}
            value={7}
          />
          <CalculatorButton
            isDisabled={props.isDisabled}
            style={styles.calculatorButton}
            value={8}
          />
          <CalculatorButton
            isDisabled={props.isDisabled}
            style={styles.calculatorButton}
            value={9}
          />
        </View>
        <View style={styles.calculatorRow}>
          <CalculatorButton
            isDisabled={props.isDisabled}
            style={styles.calculatorButton}
            value={CLEAR}
          />
          <CalculatorButton
            isDisabled={props.isDisabled}
            style={styles.calculatorButton}
            value={0}
          />
          <CalculatorButton
            isDisabled={props.isDisabled}
            style={styles.calculatorButton}
            value={DECIMAL}
          />
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
  calculatorButton: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  buttonsContainer: {
    width: '100%',
    flex: 1,
  },
  calculatorRow: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

CalculatorInput.propTypes = {
  isDisabled: PropTypes.bool,
}

export default CalculatorInput
