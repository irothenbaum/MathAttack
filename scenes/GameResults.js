import React, {useRef, useEffect, useState} from 'react'
import {View, StyleSheet, Alert} from 'react-native'
import TitleText from '../components/TitleText'
import MenuButton from '../components/MenuButton'
import {useDispatch, useSelector} from 'react-redux'
import {goToScene} from '../redux/NavigationSlice'
import {Scene_GameDailyChallenge, Scene_Menu} from '../constants/scenes'
import {selectLastGameResults, selectLastGameTypePlayed} from '../redux/selectors'
import NormalText from '../components/NormalText'
import GameResult, {getQuestionRequestClassForGame} from '../models/GameResult'
import {spaceDefault} from '../styles/layout'
import UIText from '../components/UIText'
import {formatNumber, selectRandom} from '../lib/utilities'
import {setAnswer} from '../redux/UISlice'
import {recordHighScore} from '../redux/HighScoresSlice'
import useReduxPersist from '../hooks/useReduxPersist'
import HighScoresTable from '../components/Scoring/HighScoresTable'
import SingleGameResultBottomPanel from '../components/Scoring/SingleGameResultBottomPanel'
import usePlayGame from '../hooks/usePlayGame'
import {ALL_GAMES} from '../constants/game'

function GameResults() {
  const dispatch = useDispatch()
  const results = useSelector(selectLastGameResults)
  const lastGameTypePlayed = useSelector(selectLastGameTypePlayed)
  const {flush} = useReduxPersist()
  const thisGameRef = useRef()
  const {play} = usePlayGame()

  const QuestionResultClass = getQuestionRequestClassForGame(lastGameTypePlayed)

  const score = results.reduce((total, r) => {
    return total + QuestionResultClass.scoreValue(r)
  }, 0)

  useEffect(() => {
    dispatch(setAnswer(''))

    // record our high score then flush to persist
    thisGameRef.current = new GameResult(lastGameTypePlayed, results, '')
    dispatch(recordHighScore(thisGameRef.current))
    flush().then()
    return () => {}
  }, [])

  const handlePlayAgain = () => {
    if (lastGameTypePlayed === Scene_GameDailyChallenge) {
      Alert.alert(
        null,
        'The Daily Challenge can only be played once per day. Check back tomorrow to play again. In the meantime, keep training with one of the other game modes.',
        [
          {
            text: 'Play random game',
            onPress: () => play(selectRandom(ALL_GAMES)),
          },
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
        ],
      )
      // cannot play again
      return
    }

    play(lastGameTypePlayed)
  }

  const handleMenu = () => {
    dispatch(goToScene(Scene_Menu))
  }

  return (
    <View style={styles.window}>
      <View style={styles.innerContainer}>
        <TitleText>Game Over</TitleText>

        <View style={{marginTop: spaceDefault}}>
          <NormalText>Questions: {results.length}</NormalText>
          <NormalText>Correct: {results.filter(QuestionResultClass.isCorrect).length}</NormalText>

          <UIText>Score: {formatNumber(score)}</UIText>
        </View>
      </View>

      <View style={styles.highscoresContainer}>
        <HighScoresTable game={lastGameTypePlayed} highlightScoreId={thisGameRef.current ? thisGameRef.current.id : undefined} />
      </View>

      <View style={styles.buttonContainer}>
        <MenuButton variant={MenuButton.VARIANT_DESTRUCTIVE} title={'Menu'} onPress={handleMenu} />
        <MenuButton title={'Play again'} onPress={handlePlayAgain} blurCount={2} />
      </View>

      <SingleGameResultBottomPanel />
    </View>
  )
}

const styles = StyleSheet.create({
  window: {
    width: '100%',
    height: '100%',
  },

  innerContainer: {
    padding: spaceDefault,
  },

  highscoresContainer: {
    flex: 1,
    marginTop: spaceDefault,
    paddingBottom: spaceDefault,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default GameResults
