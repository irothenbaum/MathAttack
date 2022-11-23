import useColorsControl from '../../hooks/useColorsControl'
import Equation from '../../models/Equation'
import FractionQuestionResult from '../../models/FractionQuestionResult'
import {View, StyleSheet} from 'react-native'
import NormalText from '../NormalText'
import Icon, {Star} from '../Icon'
import {font2} from '../../styles/typography'
import React from 'react'
import resultStyles from './sharedStyles'
import sharedStyles from './sharedStyles'
import PropTypes from 'prop-types'
import {spaceExtraSmall, spaceLarge} from '../../styles/layout'

/**
 * @param {number} val
 * @returns {string}
 */
function formatDecimal(val) {
  return val.toFixed(2).substr(1)
}

function EstimationRoundResult({result, count, ...props}) {
  const {yellow, green, red, foreground} = useColorsControl()
  const correctAnswer = formatDecimal(Equation.getSolution(result.question.equation))
  const userAnswer = formatDecimal(result.answer)
  const accuracy = formatDecimal(FractionQuestionResult.getAccuracy(result))

  const isTimeout = FractionQuestionResult.isTimeout(result)
  const isExact = accuracy === 0
  const score = FractionQuestionResult.scoreValue(result)
  const isCorrect = FractionQuestionResult.isCorrect(result)

  return (
    <View style={resultStyles.singleResultContainer}>
      <View style={resultStyles.singleResultEquation}>
        <NormalText>{result.question.equation.phrase.term1}</NormalText>
        <View style={[styles.fractionLine, {backgroundColor: foreground}]} />
        <NormalText>{result.question.equation.phrase.term2}</NormalText>
      </View>
      <NormalText style={resultStyles.singleResultEquals}>{isExact ? '=' : '~'}</NormalText>
      <View style={resultStyles.singleResultAnswer}>
        {isExact ? (
          <NormalText style={[sharedStyles.correctAnswerText, {color: green}]}>{correctAnswer}</NormalText>
        ) : isTimeout ? (
          <NormalText style={[sharedStyles.wrongAnswerCorrection, {color: red}]}>N/A</NormalText>
        ) : isCorrect ? (
          <React.Fragment>
            <NormalText>{correctAnswer}</NormalText>
            <NormalText style={[sharedStyles.wrongAnswerCorrection]}>({userAnswer})</NormalText>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <NormalText style={resultStyles.wrongAnswer}>{userAnswer}</NormalText>
            <NormalText style={[resultStyles.wrongAnswerCorrection, {color: red}]}>{correctAnswer}</NormalText>
          </React.Fragment>
        )}
      </View>
      <View style={resultStyles.singleResultScore}>
        <NormalText>+{score}</NormalText>
        {isExact ? <Icon icon={Star} style={resultStyles.correctAnswerCheck} size={font2} color={yellow} /> : null}
      </View>
    </View>
  )
}

export default EstimationRoundResult

const styles = StyleSheet.create({
  fractionLine: {
    width: spaceLarge,
    height: 2,
    marginVertical: spaceExtraSmall,
  },
})

EstimationRoundResult.propTypes = {
  result: PropTypes.any,
  count: PropTypes.number,
}
