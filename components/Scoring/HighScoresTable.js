import React, {useState} from 'react'
import {FlatList, StyleSheet, View} from 'react-native'
import {useSelector} from 'react-redux'
import {selectHighScoresForGame} from '../../redux/selectors'
import PropTypes from 'prop-types'
import useColorsControl from '../../hooks/useColorsControl'
import Modal from '../Modal'
import {Scene_GameEstimate} from '../../constants/scenes'
import EstimationRoundResult from './EstimationRoundResult'
import DefaultRoundResult from './DefaultRoundResult'
import HighScoreEntry from './HighScoreEntry'

// ----------------------------------------------------------------------------------------------------------

function HighScoresTable(props) {
  const {blue} = useColorsControl()
  const [viewingScore, setViewingScore] = useState(null)
  const highScores = useSelector((state) => selectHighScoresForGame(state, props.game))
  const selectedScore = highScores.find((o) => o.id === viewingScore)

  console.log(viewingScore, selectedScore)

  return (
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

      <Modal isOpen={!!selectedScore} onClose={() => setViewingScore(null)}>
        {selectedScore && (
          <FlatList
            data={selectedScore.questionResults}
            renderItem={({item, index}) =>
              props.game === Scene_GameEstimate ? (
                <EstimationRoundResult count={index + 1} result={item} />
              ) : (
                <DefaultRoundResult count={index + 1} result={item} />
              )
            }
          />
        )}
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({})

HighScoresTable.propTypes = {
  game: PropTypes.string,
  highlightScoreId: PropTypes.string,
}

export default HighScoresTable
