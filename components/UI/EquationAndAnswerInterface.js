import React from 'react'
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import EquationBox from '../EquationBox'
import {formatNumber, getVibrateStylesForAnimation} from '../../lib/utilities'
import TitleText from '../TitleText'
import {dimmedGreen, dimmedRed, neonGreen, neonRed} from '../../styles/colors'
import Equation from '../../models/Equation'
import PropTypes from 'prop-types'
import {useSelector} from 'react-redux'
import {selectCurrentQuestion, selectUserInput} from '../../redux/selectors'
import isDarkMode from '../../hooks/isDarkMode'
import {RoundBox} from '../../styles/elements'
import {spaceLarge} from '../../styles/layout'

function EquationAndAnswerInterface(props) {
  const isDark = isDarkMode()
  const currentQuestion = useSelector(selectCurrentQuestion)
  const userInput = useSelector(selectUserInput)

  return (
    <TouchableWithoutFeedback
      onPress={props.isAnimatingNextQuestion ? () => {} : props.onGuess}>
      <View style={styles.equationContainer}>
        {!!currentQuestion && (
          <Animated.View
            style={
              props.isAnimatingNextQuestion &&
              props.nextQuestionAnimation && {
                opacity: props.nextQuestionAnimation.interpolate({
                  inputRange: [0, 0.05, 0.1, 1],
                  outputRange: [1, 1, 0, 0],
                }),
              }
            }>
            <EquationBox
              style={
                !!props.answerReactionAnimation && !props.isAnimatingForCorrect
                  ? getVibrateStylesForAnimation(props.answerReactionAnimation)
                  : null
              }
              equation={currentQuestion.equation}
              timerAnimation={
                props.isAnimatingNextQuestion ? null : props.equationTimer
              }
            />
          </Animated.View>
        )}

        <Animated.View
          style={[
            styles.answerBar,
            props.isAnimatingNextQuestion &&
              props.nextQuestionAnimation && {
                transform: [
                  {
                    translateY: props.nextQuestionAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -162],
                    }),
                  },
                ],
              },
          ]}>
          <TitleText
            style={[
              styles.answerText,
              props.isAnimatingNextQuestion && {
                color: props.isAnimatingForCorrect
                  ? isDark
                    ? dimmedGreen
                    : neonGreen
                  : isDark
                  ? dimmedRed
                  : neonRed,
              },
            ]}>
            {formatNumber(
              props.isAnimatingNextQuestion
                ? Equation.getSolution(currentQuestion.equation)
                : userInput || 0,
            )}
          </TitleText>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  equationContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  answerText: {
    width: '100%',
    textAlign: 'right',
  },

  answerBar: {
    ...RoundBox,
    paddingRight: spaceLarge,
  },
})

EquationAndAnswerInterface.propTypes = {
  onGuess: PropTypes.func.isRequired,
  equationTimer: PropTypes.any,
  isAnimatingNextQuestion: PropTypes.bool,
  nextQuestionAnimation: PropTypes.any,
  answerReactionAnimation: PropTypes.any,
  isAnimatingForCorrect: PropTypes.bool,
}

export default EquationAndAnswerInterface
