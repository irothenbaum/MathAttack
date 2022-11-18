import React from 'react'
import {FlatList, StyleSheet, View} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {selectHighScoresForGame} from '../../redux/selectors'
import PropTypes from 'prop-types'
import {SCENE_TO_LABEL} from '../../constants/game'
import HighScoreEntry from './HighScoreEntry'
import NormalText from '../NormalText'
import MenuButton from '../MenuButton'
import {spaceDefault, spaceExtraLarge} from '../../styles/layout'
import usePlayGame from '../../hooks/usePlayGame'
import {setViewingGameResult} from '../../redux/HighScoresSlice'

// ----------------------------------------------------------------------------------------------------------

function HighScoresTable(props) {
  const dispatch = useDispatch()
  const highScores = useSelector((state) => selectHighScoresForGame(state, props.game))
  const {play} = usePlayGame()

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
                onPress={() => dispatch(setViewingGameResult(props.game, item.id))}
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
    </View>
  )
}

const styles = StyleSheet.create({
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
