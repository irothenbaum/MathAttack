import React, {useEffect} from 'react'
import {Animated, PanResponder, View, StyleSheet} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {selectCurrentQuestion, selectGameSettings, selectUserAnswer} from '../../redux/selectors'
import PropTypes from 'prop-types'
import useColorsControl from '../../hooks/useColorsControl'

const numberOfSteps = 10

// ----------------------------------------------------------------------------------------

function FractionInterface(props) {
  const {foreground, red} = useColorsControl()
  const answer = useSelector(selectUserAnswer)
  const settings = useSelector(selectGameSettings)

  useEffect(() => {
    if (settings.autoSubmit && answer) {
      props.onSubmitAnswer(answer)
    }
  }, [answer])

  return <View style={styles.container}></View>
}

const styles = StyleSheet.create({
  container: {},
})

FractionInterface.propTypes = {
  onSubmitAnswer: PropTypes.func.isRequired,
  onChangeTempAnswer: PropTypes.func.isRequired,
  equationTimer: PropTypes.any,
  isAnimatingNextQuestion: PropTypes.bool,
  nextQuestionAnimation: PropTypes.any,
  answerReactionAnimation: PropTypes.any,
  isAnimatingForCorrect: PropTypes.bool,
}

export default FractionInterface
