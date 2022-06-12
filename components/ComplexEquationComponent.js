import React from 'react'
import {View, StyleSheet} from 'react-native'
import Equation from '../models/Equation'
import UIText from './UIText'
import {spaceSmall} from '../styles/layout'
import {font4} from '../styles/typography'
import {dimmedRed, neonRed} from '../styles/colors'
import isDarkMode from '../hooks/isDarkMode'

function OperationTerm(props) {
  const isDark = isDarkMode()
  return <UIText style={[styles.operationTerm, {color: isDark ? dimmedRed : neonRed}]}>{props.operator}</UIText>
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
      {numbersAndOperators.map((numOrOp, i) =>
        typeof numOrOp === 'number' ? <NumberTerm key={i} number={numOrOp} /> : <OperationTerm key={i} operator={numOrOp} />,
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
    fontSize: font4,
    flex: 0,
  },
})

export default ComplexEquationComponent
