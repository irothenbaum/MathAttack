import useColorsControl from '../../hooks/useColorsControl'
import Equation from '../../models/Equation'
import EstimationQuestionResult from '../../models/EstimationQuestionResult'
import {View} from 'react-native'
import NormalText from '../NormalText'
import Icon, {Check, Star, X} from '../Icon'
import {font2} from '../../styles/typography'
import React from 'react'
import resultStyles from './sharedStyles'
import sharedStyles from './sharedStyles'

function EstimationRoundResult({result, count}) {
  const {yellow, green, red} = useColorsControl()
  const correctAnswer = Equation.getSolution(result.question.equation)
  const userAnswer = result.answer
  const accuracy = EstimationQuestionResult.getAccuracy(result)

  const isTimeout = EstimationQuestionResult.isTimeout(result)
  const isExact = accuracy === 0
  const score = EstimationQuestionResult.scoreValue(result)
  const isCorrect = EstimationQuestionResult.isCorrect(result)

  return (
    <View style={resultStyles.singleResultContainer}>
      <View style={resultStyles.singleResultEquation}>
        {Equation.getLeftSideInfixNotation(result.question.equation).map((str, index) => {
          return <NormalText key={`${str}-${index}`}>{str}</NormalText>
        })}
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
