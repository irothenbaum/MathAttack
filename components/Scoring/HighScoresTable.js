import React, {useState} from 'react'
import {FlatList, ScrollView, StyleSheet, View} from 'react-native'
import {useSelector} from 'react-redux'
import {selectHighScoresForGame} from '../../redux/selectors'
import PropTypes from 'prop-types'
import {Scene_GameEstimate} from '../../constants/scenes'
import {SCENE_TO_LABEL} from '../../constants/game'
import EstimationRoundResult from './EstimationRoundResult'
import DefaultRoundResult from './DefaultRoundResult'
import HighScoreEntry from './HighScoreEntry'
import NormalText from '../NormalText'
import MenuButton from '../MenuButton'
import {spaceDefault, spaceExtraLarge} from '../../styles/layout'
import usePlayGame from '../../hooks/usePlayGame'
import DefaultResultsHeader from './DefaultResultsHeader'
import {FullScreenOverlay, height, width} from '../../styles/elements'
import BottomPanel from '../BottomPanel'

// ----------------------------------------------------------------------------------------------------------

function HighScoresTable(props) {
  const [viewingScore, setViewingScore] = useState(null)
  const highScores = useSelector((state) => selectHighScoresForGame(state, props.game))
  const selectedScore = highScores.find((o) => o.id === viewingScore)
  const {play} = usePlayGame()

  console.log(selectedScore ? selectedScore.questionResults.length : 'n/a')

  return (
    <View style={{height: '100%', width: '100%'}}>
      {highScores.length > 0 ? (
        <View>
          <FlatList
            data={highScores}
            renderItem={({item, index}) => (
              <HighScoreEntry
                place={index + 1}
                result={item}
                isHighlighted={item.id === props.highlightScoreId}
                onPress={() => setViewingScore(item.id)}
              />
            )}
          />
        </View>
      ) : (
        <View>
          <NormalText style={[styles.noScoresContainer]}>No high scores yet.</NormalText>
          <MenuButton
            blurCount={3}
            title={`Play ${SCENE_TO_LABEL[props.game]}`}
            style={{marginHorizontal: spaceDefault}}
            onPress={() => play(props.game)}
          />
        </View>
      )}

      <BottomPanel isOpen={!!selectedScore} onClose={() => setViewingScore(null)}>
        <DefaultResultsHeader />
        {selectedScore ? (
          <FlatList
            data={selectedScore.questionResults}
            keyExtractor={(item) => item.id}
            renderItem={({item, index}) =>
              props.game === Scene_GameEstimate ? (
                <EstimationRoundResult count={index + 1} result={item} />
              ) : (
                <DefaultRoundResult count={index + 1} result={item} />
              )
            }
          />
        ) : null}
      </BottomPanel>
    </View>
  )
}

const styles = StyleSheet.create({
  singleScoresOverlay: {
    ...FullScreenOverlay,
    zIndex: 10,
  },
  singleScoreContainer: {
    height: '90%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  noScoresContainer: {
    margin: spaceDefault,
    padding: spaceDefault,
    borderRadius: 4,
    marginVertical: spaceExtraLarge,
    textAlign: 'center',
  },
  noScores: {},
})

HighScoresTable.propTypes = {
  game: PropTypes.string,
  highlightScoreId: PropTypes.string,
}

export default HighScoresTable
