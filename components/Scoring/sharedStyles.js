import {StyleSheet} from 'react-native'
import {spaceDefault, spaceSmall} from '../../styles/layout'
import {font4} from '../../styles/typography'

export default StyleSheet.create({
  singleResultContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spaceSmall,
    borderBottomWidth: 1,
    padding: spaceDefault,
  },

  singleResultEquation: {
    flex: 1,
    alignItems: 'center',
  },

  singleResultEquals: {
    flex: 1,
    textAlign: 'center',
  },

  singleResultAnswer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  singleResultScore: {
    flex: 1,
    alignItems: 'flex-end',
  },

  wrongAnswer: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },

  wrongAnswerCorrection: {
    marginLeft: spaceSmall,
  },

  correctAnswerCheck: {
    fontSize: font4,
    marginLeft: spaceSmall,
  },
})
