import React from 'react'
import {Animated, StyleSheet, View, TouchableWithoutFeedback} from 'react-native'
import EquationBox from '../EquationBox'
import {formatNumber, getVibrateStylesForAnimation} from '../../lib/utilities'
import TitleText from '../TitleText'
import Equation from '../../models/Equation'
import PropTypes from 'prop-types'
import {useSelector} from 'react-redux'
import {selectCurrentQuestion, selectUserInput} from '../../redux/selectors'
import {RoundBox} from '../../styles/elements'
import {spaceLarge} from '../../styles/layout'
import useColorsControl from '../../hooks/useColorsControl'

function EquationAndAnswerInterface(props) {
  const {shadow, getResultColor} = useColorsControl()
  const currentQuestion = useSelector(selectCurrentQuestion)
  const userInput = useSelector(selectUserInput)

  const onPress = () => {
    // cannot press while animating or if they haven't entered a guess
    if (props.isAnimatingNextQuestion || userInput.length === 0) {
      return
    }

    props.onGuess(userInput)
  }

  return (
    <TouchableWithoutFeedback onPress={onPress}>
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
            }
          >
            <EquationBox
              style={
                !!props.answerReactionAnimation && !props.isAnimatingForCorrect
                  ? getVibrateStylesForAnimation(props.answerReactionAnimation, null, 0.25)
                  : null
              }
              equation={currentQuestion.equation}
              timerAnimation={props.equationTimer}
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
          ]}
        >
          <TitleText
            style={[
              styles.answerText,
              userInput.length === 0 && {
                color: shadow,
              },
              props.isAnimatingNextQuestion && {
                color: getResultColor(props.isAnimatingForCorrect),
              },
            ]}
          >
            {formatNumber(props.isAnimatingNextQuestion ? Equation.getSolution(currentQuestion.equation) : userInput || 0)}
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
