import React, {useCallback, useState} from 'react'
import {View, StyleSheet, Text, FlatList} from 'react-native'
import TitleText from '../components/TitleText'
import MenuButton from '../components/MenuButton'
import {useDispatch, useSelector} from 'react-redux'
import {goToScene} from '../redux/NavigationSlice'
import {startNewGame as startNewClassicGame} from '../redux/GameClassicSlice'
import {startNewGame as startNewMarathonGame} from '../redux/GameClassicSlice'
import {
  Scene_GameClassic,
  Scene_GameMarathon,
  Scene_Menu,
} from '../constants/scenes'
import {
  selectGameSettings,
  selectLastGameResults,
  selectLastGameTypePlayed,
} from '../redux/selectors'
import NormalText from '../components/NormalText'
import Equation from '../models/Equation'
import QuestionResult from '../models/QuestionResult'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {faCheck} from '@fortawesome/free-solid-svg-icons'
import {
  dimmedBlue,
  dimmedGreen,
  dimmedRed,
  neonBlue,
  neonGreen,
  neonRed,
} from '../styles/colors'
import {font4} from '../styles/typography'
import {spaceDefault, spaceSmall} from '../styles/layout'
import UIText from '../components/UIText'
import isDarkMode from '../hooks/isDarkMode'
import {formatNumber} from '../lib/utilities'

const resultStyles = StyleSheet.create({
  singleResultContainer: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: spaceSmall,
  },

  singleResultCount: {
    width: '15%',
  },

  singleResultEquals: {
    width: '5%',
  },

  singleResultEquation: {
    width: '40%',
  },

  singleResultAnswer: {
    width: '20%',
    alignItems: 'flex-end',
  },

  singleResultCanon: {
    width: '15%',
    alignItems: 'flex-end',
  },

  wrongAnswer: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },

  correctAnswerCheck: {
    fontSize: font4,
  },
})

function SingleGameResult({result, count}) {
  const correctAnswer = Equation.getSolution(result.question.equation)
  const userAnswer = result.answer

  let isTimeout = QuestionResult.isTimeout(result)
  let isCorrect = QuestionResult.isCorrect(result)

  return (
    <View style={resultStyles.singleResultContainer}>
      <View style={resultStyles.singleResultCount}>
        <NormalText>{count}.</NormalText>
      </View>
      <View style={resultStyles.singleResultEquation}>
        <NormalText>
          {Equation.getLeftSide(result.question.equation)}
        </NormalText>
      </View>
      <NormalText style={resultStyles.singleResultEquals}>=</NormalText>
      <View style={resultStyles.singleResultAnswer}>
        <NormalText style={isCorrect ? null : resultStyles.wrongAnswer}>
          {isTimeout ? 'N/A' : userAnswer}
        </NormalText>
      </View>
      <View style={resultStyles.singleResultCanon}>
        {isCorrect ? (
          <FontAwesomeIcon
            icon={faCheck}
            style={resultStyles.correctAnswerCheck}
            color={isDarkMode() ? dimmedGreen : neonGreen}
          />
        ) : (
          <NormalText style={{color: isDarkMode() ? dimmedRed : neonRed}}>
            {correctAnswer}
          </NormalText>
        )}
      </View>
    </View>
  )
}

function GameResults() {
  const dispatch = useDispatch()
  const settings = useSelector(selectGameSettings)
  const [isShowingDetails, setIsShowingDetails] = useState(false)
  const results = useSelector(selectLastGameResults)
  const lastGameTypePlayed = useSelector(selectLastGameTypePlayed)

  const score = results.reduce((total, r) => {
    return total + QuestionResult.scoreValue(r)
  }, 0)

  const handlePlayAgain = () => {
    switch (lastGameTypePlayed) {
      case Scene_GameClassic:
        dispatch(startNewClassicGame(settings))
        break

      case Scene_GameMarathon:
        dispatch(startNewMarathonGame(settings))
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
          <NormalText>
            Correct: {results.filter(QuestionResult.isCorrect).length}
          </NormalText>

          <UIText>Score: {formatNumber(score)}</UIText>
        </View>

        <View style={styles.detailsContainer}>
          {isShowingDetails && (
            <FlatList
              data={results}
              renderItem={({item, index}) => (
                <SingleGameResult count={index + 1} result={item} />
              )}
            />
          )}
          <NormalText
            style={{color: isDarkMode() ? dimmedBlue : neonBlue}}
            onPress={() => setIsShowingDetails(!isShowingDetails)}>
            {isShowingDetails ? 'Hide details' : 'Show details'}
          </NormalText>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <MenuButton title={'Play Again'} onPress={handlePlayAgain} />
        <MenuButton
          variant={MenuButton.VARIANT_DESTRUCTIVE}
          title={'Menu'}
          onPress={handleMenu}
        />
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

  detailsContainer: {
    padding: spaceDefault,
    flex: 1,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default GameResults
