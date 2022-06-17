import React from 'react'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {faCircle, faDotCircle} from '@fortawesome/free-solid-svg-icons'
import {font1} from '../../styles/typography'
import {StyleSheet, View} from 'react-native'
import {spaceDefault, spaceSmall} from '../../styles/layout'
import isDarkMode from '../../hooks/isDarkMode'
import {sunbeam, shadow, dimmedRed, neonRed} from '../../styles/colors'
import {getUIColor} from '../../lib/utilities'

function RoundsRemainingUI(props) {
  const arr = [...new Array(props.total)].map((e, i) => i)
  const isDark = isDarkMode()

  const getColorForDot = (isActive, isPast) => {
    return isActive ? (isDark ? dimmedRed : neonRed) : isPast ? (isDark ? sunbeam : shadow) : getUIColor(isDark)
  }

  const numberCompleted = props.total - props.remaining
  return (
    <View style={styles.container}>
      {arr.map((i) => {
        const isActive = i === numberCompleted
        const isPast = i < numberCompleted
        return <FontAwesomeIcon key={i} icon={isPast ? faDotCircle : faCircle} size={font1} color={getColorForDot(isActive, isPast)} />
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spaceDefault,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
})

RoundsRemainingUI.propTypes = {
  remaining: PropTypes.number,
  total: PropTypes.number,
}

export default RoundsRemainingUI
