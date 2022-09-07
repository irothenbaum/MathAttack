import React, {useRef, useEffect, useState} from 'react'
import {View, StyleSheet, FlatList} from 'react-native'
import TitleText from '../components/TitleText'
import MenuButton from '../components/MenuButton'
import {useDispatch, useSelector} from 'react-redux'
import {goToScene} from '../redux/NavigationSlice'
import {startNewGame as startNewClassicGame} from '../redux/GameSlice'
import {startNewGame as startNewMarathonGame} from '../redux/GameSlice'
import {startNewGame as startNewEstimateGame} from '../redux/GameSlice'
import {startNewGame as startNewCrescendoGame} from '../redux/GameSlice'
import {startNewGame as startNewVersusGame} from '../redux/GameSlice'
import {
  Scene_GameClassic,
  Scene_GameCrescendo,
  Scene_GameEstimate,
  Scene_GameMarathon,
  Scene_GameVersus,
  Scene_Menu,
} from '../constants/scenes'
import {selectGameSettings, selectLastGameResults, selectLastGameTypePlayed, selectHighScoresForLastGamePlayed} from '../redux/selectors'
import NormalText from '../components/NormalText'
import QuestionResult from '../models/QuestionResult'
import GameResult from '../models/GameResult'
import {spaceDefault, spaceSmall} from '../styles/layout'
import UIText from '../components/UIText'
import {formatNumber} from '../lib/utilities'
import {setAnswer} from '../redux/UISlice'
import EstimationQuestionResult from '../models/EstimationQuestionResult'
import {recordHighScore} from '../redux/HighScoresSlice'
import useReduxPersist from '../hooks/useReduxPersist'
import HighScoresTable from '../components/Scoring/HighScoresTable'

function GameResults() {
  const dispatch = useDispatch()
  const settings = useSelector(selectGameSettings)
  const results = useSelector(selectLastGameResults)
  const lastGameTypePlayed = useSelector(selectLastGameTypePlayed)
  const {flush} = useReduxPersist()
  const thisGameRef = useRef()

  const QuestionResultClass = lastGameTypePlayed === Scene_GameEstimate ? EstimationQuestionResult : QuestionResult

  const score = results.reduce((total, r) => {
    return total + QuestionResultClass.scoreValue(r)
  }, 0)

  useEffect(() => {
    dispatch(setAnswer(''))

    // record our high score then flush to persist
    thisGameRef.current = new GameResult(lastGameTypePlayed, results, '')
    dispatch(recordHighScore(thisGameRef.current))
    flush()
    return () => {}
  }, [])

  const handlePlayAgain = () => {
    switch (lastGameTypePlayed) {
      case Scene_GameClassic:
        dispatch(startNewClassicGame(settings))
        break

      case Scene_GameMarathon:
        dispatch(startNewMarathonGame(settings))
        break

      case Scene_GameEstimate:
        dispatch(startNewEstimateGame(settings))
        break

      case Scene_GameCrescendo:
        dispatch(startNewCrescendoGame(settings))
        break

      case Scene_GameVersus:
        dispatch(startNewVersusGame(settings))
        break

      default:
        throw new Error('Cannot replay game, unknown type' + lastGameTypePlayed)
    }

    dispatch(goToScene(lastGameTypePlayed))
  }

  const handleMenu = () => {
    dispatch(goToScene(Scene_Menu))
  }

  return (
    <View style={styles.window}>
      <TitleText>Game Over</TitleText>

      <View style={styles.resultsContainer}>
        <View>
          <NormalText>Questions: {results.length}</NormalText>
          <NormalText>Correct: {results.filter(QuestionResultClass.isCorrect).length}</NormalText>

          <UIText>Score: {formatNumber(score)}</UIText>
        </View>

        <View style={styles.highscoresContainer}>
          <HighScoresTable game={lastGameTypePlayed} highlightScoreId={thisGameRef.current ? thisGameRef.current.id : undefined} />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <MenuButton variant={MenuButton.VARIANT_DESTRUCTIVE} title={'Menu'} onPress={handleMenu} />
        <MenuButton title={'Play again'} onPress={handlePlayAgain} blurCount={2} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  window: {
    width: '100%',
    height: '100%',
    padding: spaceDefault,
  },

  resultsContainer: {
    flex: 1,
    marginTop: spaceDefault,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  highscoresContainer: {
    flex: 1,
  },
})

export default GameResults
