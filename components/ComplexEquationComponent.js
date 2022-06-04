import React from 'react'
import {View, StyleSheet} from 'react-native'
import Equation from '../models/Equation'
import UIText from './UIText'
import {spaceSmall} from '../styles/layout'

function OperationTerm(props) {
  return <UIText style={styles.operationTerm}>{props.operator}</UIText>
}

// ---------------------------------------------------------------------

function NumberTerm(props) {
  return (
    <View style={styles.numberTerm}>
      <UIText>{props.number}</UIText>
    </View>
  )
}

// ---------------------------------------------------------------------

function ComplexEquationComponent(props) {
  const numbersAndOperators = Equation.getLeftSideInfixNotation(props.equation)

  return (
    <View style={styles.termsContainer}>
      {numbersAndOperators.map((numOrOp) =>
        typeof numOrOp === 'number' ? <NumberTerm number={numOrOp} /> : <OperationTerm operator={numOrOp} />,
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  termsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  numberTerm: {
    flex: 1,
    justifyContent: 'center',
  },

  operationTerm: {
    padding: spaceSmall,
    flex: 0,
  },
})

export default ComplexEquationComponent
