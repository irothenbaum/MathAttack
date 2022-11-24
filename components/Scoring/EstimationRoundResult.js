import useColorsControl from '../../hooks/useColorsControl'
import Equation from '../../models/Equation'
import EstimationQuestionResult from '../../models/EstimationQuestionResult'
import {View} from 'react-native'
import NormalText from '../NormalText'
import Icon, {Star} from '../Icon'
import {font2} from '../../styles/typography'
import React from 'react'
import sharedStyles from './sharedStyles'
import PropTypes from 'prop-types'

function EstimationRoundResult({result}) {
  const {yellow, red} = useColorsControl()
  const correctAnswer = Equation.getSolution(result.question.equation)
  const userAnswer = result.answer

  const isTimeout = EstimationQuestionResult.isTimeout(result)
  const isExact = EstimationQuestionResult.isPerfect(result)
  const score = EstimationQuestionResult.scoreValue(result)
  const isCorrect = EstimationQuestionResult.isCorrect(result)

  return (
    <View style={sharedStyles.singleResultContainer}>
      <View style={sharedStyles.singleResultEquation}>
        {Equation.getLeftSideInfixNotation(result.question.equation).map((str, index) => {
          return <NormalText key={`${str}-${index}`}>{str}</NormalText>
        })}
      </View>
      <NormalText style={sharedStyles.singleResultEquals}>{isExact ? '=' : '~'}</NormalText>
      <View style={sharedStyles.singleResultAnswer}>
        {isExact ? (
          <React.Fragment>
            <NormalText style={sharedStyles.correctAnswerText}>{correctAnswer}</NormalText>
            <Icon icon={Star} style={sharedStyles.correctAnswerCheck} size={font2} color={yellow} />
          </React.Fragment>
        ) : isTimeout ? (
          <NormalText style={[sharedStyles.wrongAnswerCorrection, {color: red}]}>N/A</NormalText>
        ) : isCorrect ? (
          <React.Fragment>
            <NormalText>{correctAnswer}</NormalText>
            <NormalText style={[sharedStyles.wrongAnswerCorrection]}>({userAnswer})</NormalText>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <NormalText style={sharedStyles.wrongAnswer}>{userAnswer}</NormalText>
            <NormalText style={[sharedStyles.wrongAnswerCorrection, {color: red}]}>{correctAnswer}</NormalText>
          </React.Fragment>
        )}
      </View>
      <View style={sharedStyles.singleResultScore}>
        <NormalText>+{score}</NormalText>
      </View>
    </View>
  )
}

export default EstimationRoundResult

EstimationRoundResult.propTypes = {
  result: PropTypes.any,
  count: PropTypes.number,
}
