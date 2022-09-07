import useColorsControl from '../../hooks/useColorsControl'
import {Pressable, StyleSheet, View} from 'react-native'
import {fadeColor, formatNumber} from '../../lib/utilities'
import NormalText from '../NormalText'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import {spaceSmall} from '../../styles/layout'
import Icon, {Expand} from '../Icon'
import {font1} from '../../styles/typography'

/**
 * @param {{result: GameResult}} props
 */
function HighScoreEntry(props) {
  const {foreground, blue, shadowLight, green} = useColorsControl()
  const textColor = foreground

  return (
    <Pressable onPress={props.onPress}>
      <View
        style={[
          styles.scoreEntryContainer,
          props.place % 2 === 0 ? {backgroundColor: shadowLight} : undefined,
          props.isHighlighted ? {backgroundColor: fadeColor(green, 0.2)} : undefined,
        ]}
      >
        <NormalText style={[styles.recordText, {width: '10%', color: textColor}]}>{props.place}.</NormalText>
        <NormalText style={[styles.recordText, {color: textColor}]}>{moment(props.result.dateCreated).format('YYYY-MM-DD')}</NormalText>
        <NormalText style={[styles.scoreText, {color: textColor}]}>{formatNumber(props.result.finalScore)}</NormalText>
        <Icon icon={Expand} color={blue} size={font1} style={styles.expandIcon} />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  scoreEntryContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spaceSmall,
    padding: spaceSmall,
  },

  recordText: {
    fontSize: 14,
  },

  scoreText: {
    textAlign: 'right',
    fontWeight: 'bold',
    flex: 1,
  },

  expandIcon: {
    marginLeft: spaceSmall,
  },
})

HighScoreEntry.propTypes = {
  result: PropTypes.object.isRequired,
  isHighlighted: PropTypes.bool,
  onPress: PropTypes.func,
}

export default HighScoreEntry
