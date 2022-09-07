import {StyleSheet} from 'react-native'
import {spaceSmall} from '../../styles/layout'
import {font4} from '../../styles/typography'

export default StyleSheet.create({
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

  correctAnswerCheck: {
    fontSize: font4,
  },
})
