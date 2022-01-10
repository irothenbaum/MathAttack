import React, {useCallback} from 'react'
import {View, StyleSheet, Text} from 'react-native'
import TitleText from '../components/TitleText'
import MenuButton from '../components/MenuButton'
import {useDispatch, useSelector} from 'react-redux'
import {goToScene} from '../redux/NavigationSlice'
import {startNewGame} from '../redux/GameClassicSlice'
import {Scene_GameClassic, Scene_Menu} from '../constants/scenes'
import {
  selectClassicGameSettings,
  selectCurrentSceneParams,
  selectLastGameResults,
} from '../redux/selectors'
import NormalText from '../components/NormalText'
import Equation from '../models/Equation'
import QuestionResult from '../models/QuestionResult'
import FontAwesome, {SolidIcons} from 'react-native-fontawesome'
import {neonGreen, neonRed} from '../styles/colors'
import {font4} from '../styles/typography'
import {spaceDefault} from '../styles/layout'

const styles = StyleSheet.create({
  window: {width: '100%', height: '100%'},

  resultsContainer: {flex: 1},

  singleResult: {
    flexDirection: 'row',
  },

  resultEquation: {
    width: '50%',
  },

  wrongAnswer: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },

  correctAnswerCheck: {
    color: neonGreen,
    fontSize: font4,
  },

  wrongAnswerX: {
    correctAnswerCheck: {
      color: neonRed,
      fontSize: font4,
    },
  },

  buttonContainer: {
    flexDirection: 'row',
  },
})

function SingleGameResult({result}) {
  const correctAnswer = Equation.getSolution(result.question.equation)
  const userAnswer = result.answer

  let isTimeout = QuestionResult.isTimeout(result)
  let isCorrect = QuestionResult.isCorrect(result)

  return (
    <View style={styles.singleResult}>
      <NormalText style={styles.resultEquation}>
        {Equation.getLeftSide(result.question.equation)}
      </NormalText>
      <NormalText style={isCorrect ? null : styles.wrongAnswer}>
        {isTimeout ? 'N/A' : userAnswer}
      </NormalText>
      {isCorrect ? (
        <FontAwesome
          icon={SolidIcons.check}
          style={styles.correctAnswerCheck}
        />
      ) : (
        <NormalText>{correctAnswer}</NormalText>
      )}
    </View>
  )
}

function GameResults() {
  const dispatch = useDispatch()
  const settings = useSelector(selectClassicGameSettings)
  const results = useSelector(selectLastGameResults)

  const handlePlayAgain = () => {
    dispatch(startNewGame(settings))
    dispatch(goToScene(Scene_GameClassic))
  }

  const handleMenu = () => {
    dispatch(goToScene(Scene_Menu))
  }

  return (
    <View style={styles.window}>
      <TitleText>Game Over</TitleText>

      <View style={styles.resultsContainer}>
        {results.map((questionResult, i) => (
          <SingleGameResult key={i} result={questionResult} />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <MenuButton title={'Play Again'} onPress={handlePlayAgain} />
        <MenuButton title={'Menu'} onPress={handleMenu} />
      </View>
    </View>
  )
}

export default GameResults
