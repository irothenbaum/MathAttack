import React, {useState, useRef, useEffect, useCallback} from 'react'
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import TitleText from '../components/TitleText'
import InGameMenu from '../components/InGameMenu'
import {ScreenContainer} from '../styles/elements'
import {useDispatch, useSelector} from 'react-redux'
import {selectCurrentQuestion, selectGameSettings} from '../redux/selectors'
import GameStartTimer from '../components/GameStartTimer'
import {generateNewEstimationQuestion} from '../redux/GameSlice'
import GameQuestion from '../models/GameQuestion'
import EstimationInterface from '../components/UI/EstimationInterface'
import ComplexEquationComponent from '../components/ComplexEquationComponent'
import {spaceDefault, spaceExtraLarge} from '../styles/layout'

function GameEstimate() {
  const settings = useSelector(selectGameSettings)
  const currentQuestion = useSelector(selectCurrentQuestion)
  const dispatch = useDispatch()

  const handleGameStart = () => {
    dispatch(generateNewEstimationQuestion())
  }

  useEffect(() => {
    handleGameStart()
  }, [])

  return (
    <View style={styles.window}>
      <InGameMenu />
      {false && !currentQuestion && <GameStartTimer onStart={handleGameStart} />}
      <View style={styles.questionContainer}>{currentQuestion && <ComplexEquationComponent equation={currentQuestion.equation} />}</View>
      <EstimationInterface />
    </View>
  )
}

const styles = StyleSheet.create({
  window: {
    ...ScreenContainer,
    flexDirection: 'row',
  },

  questionContainer: {
    flex: 1,
    height: '100%',
    padding: spaceDefault,
    paddingBottom: spaceExtraLarge,
  },
})

export default GameEstimate
