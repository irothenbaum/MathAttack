import useColorsControl from '../../hooks/useColorsControl'
import Equation from '../../models/Equation'
import EstimationQuestionResult from '../../models/EstimationQuestionResult'
import {View} from 'react-native'
import NormalText from '../NormalText'
import Icon, {Check, Star} from '../Icon'
import {font2} from '../../styles/typography'
import React from 'react'
import resultStyles from './sharedStyles'

function EstimationRoundResult({result, count}) {
  const {yellow, green, red} = useColorsControl()
  const correctAnswer = Equation.getSolution(result.question.equation)
  const userAnswer = result.answer
  const accuracy = EstimationQuestionResult.getAccuracy(result)

  let isTimeout = EstimationQuestionResult.isTimeout(result)
  let isExact = accuracy === 0
  let isCorrect = EstimationQuestionResult.isCorrect(result)

  return (
    <View style={resultStyles.singleResultContainer}>
      <View style={resultStyles.singleResultCount}>
        <NormalText>{count}.</NormalText>
      </View>
      <View style={resultStyles.singleResultEquation}>
        <NormalText>
          {correctAnswer} {' \u2022 '} {isTimeout ? 'N/A' : userAnswer}
        </NormalText>
      </View>
      <NormalText style={resultStyles.singleResultEquals}>~</NormalText>
      <View style={resultStyles.singleResultAnswer}>
        <NormalText style={isExact ? {fontWeight: 'bold'} : isCorrect ? null : resultStyles.wrongAnswer}>
          {isTimeout ? 'N/A' : accuracy}
        </NormalText>
      </View>
      <View style={resultStyles.singleResultCanon}>
        {isCorrect ? (
          <Icon icon={isExact ? Star : Check} style={resultStyles.correctAnswerCheck} size={font2} color={isExact ? yellow : green} />
        ) : (
          <NormalText style={{color: red}}>{correctAnswer}</NormalText>
        )}
      </View>
    </View>
  )
}

export default EstimationRoundResult
