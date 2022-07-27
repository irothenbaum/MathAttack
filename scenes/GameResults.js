import React, {useEffect, useState} from 'react'
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
import {selectGameSettings, selectLastGameResults, selectLastGameTypePlayed} from '../redux/selectors'
import NormalText from '../components/NormalText'
import Equation from '../models/Equation'
import QuestionResult from '../models/QuestionResult'
import {dimmedBlue, dimmedGreen, dimmedRed, neonBlue, neonGreen, neonRed, neonYellow, dimmedYellow} from '../styles/colors'
import {font2, font4} from '../styles/typography'
import {spaceDefault, spaceSmall} from '../styles/layout'
import UIText from '../components/UIText'
import useDarkMode from '../hooks/useDarkMode'
import {formatNumber} from '../lib/utilities'
import {setAnswer} from '../redux/UISlice'
import EstimationQuestionResult from '../models/EstimationQuestionResult'
import Icon, {Check, Star} from '../components/Icon'

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
    justifyContent: 'center',
  },

  wrongAnswer: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },

  exactAnswer: {
    fontWeight: 'bold',
  },

  correctAnswerCheck: {
    fontSize: font4,
  },
})

function SingleGameResult({result, count}) {
  const isDark = useDarkMode()
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
        <NormalText>{Equation.getLeftSide(result.question.equation)}</NormalText>
      </View>
      <NormalText style={resultStyles.singleResultEquals}>=</NormalText>
      <View style={resultStyles.singleResultAnswer}>
        <NormalText style={isCorrect ? null : resultStyles.wrongAnswer}>{isTimeout ? 'N/A' : userAnswer}</NormalText>
      </View>
      <View style={resultStyles.singleResultCanon}>
        {isCorrect ? (
          <Icon icon={Check} style={resultStyles.correctAnswerCheck} size={font2} color={isDark ? dimmedGreen : neonGreen} />
        ) : (
          <NormalText style={{color: isDark ? dimmedRed : neonRed}}>{correctAnswer}</NormalText>
        )}
      </View>
    </View>
  )
}

function EstimationGameResult({result, count}) {
  const isDark = useDarkMode()
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
        <NormalText style={isExact ? resultStyles.exactAnswer : isCorrect ? null : resultStyles.wrongAnswer}>{accuracy}</NormalText>
      </View>
      <View style={resultStyles.singleResultCanon}>
        {isCorrect ? (
          <Icon
            icon={isExact ? Star : Check}
            style={resultStyles.correctAnswerCheck}
            size={font2}
            color={isExact ? (isDark ? dimmedYellow : neonYellow) : isDark ? dimmedGreen : neonGreen}
          />
        ) : (
          <NormalText style={{color: isDark ? dimmedRed : neonRed}}>{correctAnswer}</NormalText>
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

  const QuestionResultClass = lastGameTypePlayed === Scene_GameEstimate ? EstimationQuestionResult : QuestionResult

  const score = results.reduce((total, r) => {
    return total + QuestionResultClass.scoreValue(r)
  }, 0)

  useEffect(() => {
    dispatch(setAnswer(''))
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

        <View style={styles.detailsContainer}>
          {isShowingDetails && (
            <FlatList
              data={results}
              renderItem={({item, index}) =>
                lastGameTypePlayed === Scene_GameEstimate ? (
                  <EstimationGameResult count={index + 1} result={item} />
                ) : (
                  <SingleGameResult count={index + 1} result={item} />
                )
              }
            />
          )}
          <NormalText style={{color: useDarkMode() ? dimmedBlue : neonBlue}} onPress={() => setIsShowingDetails(!isShowingDetails)}>
            {isShowingDetails ? 'Hide details' : 'Show details'}
          </NormalText>
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
