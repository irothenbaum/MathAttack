import useColorsControl from '../../hooks/useColorsControl'
import Equation from '../../models/Equation'
import QuestionResult from '../../models/QuestionResult'
import {View} from 'react-native'
import NormalText from '../NormalText'
import Icon, {Check} from '../Icon'
import {font2} from '../../styles/typography'
import React from 'react'
import resultStyles from './sharedStyles'

function DefaultRoundResult({result}) {
  const {green, red} = useColorsControl()
  const correctAnswer = Equation.getSolution(result.question.equation)
  const userAnswer = result.answer

  let isTimeout = QuestionResult.isTimeout(result)
  let isCorrect = QuestionResult.isCorrect(result)

  return (
    <View style={resultStyles.singleResultContainer}>
      <View style={resultStyles.singleResultEquation}>
        {Equation.getLeftSideInfixNotation(result.question.equation).map((str, index) => {
          return <NormalText key={`${str}-${index}`}>{str}</NormalText>
        })}
      </View>
      <NormalText style={resultStyles.singleResultEquals}>=</NormalText>
      <View style={resultStyles.singleResultAnswer}>
        <NormalText style={isCorrect ? null : resultStyles.wrongAnswer}>{isTimeout ? 'N/A' : userAnswer}</NormalText>
        {isCorrect ? (
          <Icon icon={Check} style={resultStyles.correctAnswerCheck} size={font2} color={green} />
        ) : (
          <NormalText style={[resultStyles.wrongAnswerCorrection, {color: red}]}>{correctAnswer}</NormalText>
        )}
      </View>
      <View style={resultStyles.singleResultScore}>
        <NormalText>+{QuestionResult.scoreValue(result)}</NormalText>
      </View>
    </View>
  )
}

export default DefaultRoundResult
