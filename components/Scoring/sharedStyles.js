import {StyleSheet} from 'react-native'
import {spaceDefault, spaceExtraLarge, spaceSmall} from '../../styles/layout'
import {font3} from '../../styles/typography'

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
    width: spaceDefault,
    textAlign: 'center',
  },

  singleResultAnswer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  singleResultScore: {
    width: spaceExtraLarge,
    alignItems: 'center',
  },

  wrongAnswer: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },

  wrongAnswerCorrection: {
    fontWeight: 'bold',
    marginLeft: spaceSmall,
  },

  correctAnswerCheck: {
    marginLeft: spaceSmall,
  },

  correctAnswerText: {
    fontSize: font3,
    fontWeight: 'bold',
  },
})
