import DefaultResultsHeader from './DefaultResultsHeader'
import {FlatList} from 'react-native'
import {Scene_GameEstimate} from '../../constants/scenes'
import EstimationRoundResult from './EstimationRoundResult'
import DefaultRoundResult from './DefaultRoundResult'
import BottomPanel from '../BottomPanel'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {selectViewingGameResult} from '../../redux/selectors'
import {setViewingGameResult} from '../../redux/HighScoresSlice'

function SingleGameResultBottomPanel() {
  const dispatch = useDispatch()
  const selectedScore = useSelector(selectViewingGameResult)

  return (
    <BottomPanel isOpen={!!selectedScore} onClose={() => dispatch(setViewingGameResult())}>
      <DefaultResultsHeader />
      {selectedScore ? (
        <FlatList
          data={selectedScore.questionResults}
          keyExtractor={(item) => item.id}
          renderItem={({item, index}) =>
            selectedScore.game === Scene_GameEstimate ? (
              <EstimationRoundResult count={index + 1} result={item} />
            ) : (
              <DefaultRoundResult count={index + 1} result={item} />
            )
          }
        />
      ) : null}
    </BottomPanel>
  )
}

export default SingleGameResultBottomPanel
