import React from 'react'
import PropTypes from 'prop-types'
import {font1} from '../../styles/typography'
import {StyleSheet, View} from 'react-native'
import {spaceDefault} from '../../styles/layout'
import Icon, {CircleActive, CircleInactive} from '../Icon'
import useColorsControl from '../../hooks/useColorsControl'

function RoundsRemainingUI(props) {
  const arr = [...new Array(props.total)].map((e, i) => i)
  const {foreground, shadow, red} = useColorsControl()

  const getColorForDot = (isActive, isPast) => {
    return isActive ? red : isPast ? shadow : foreground
  }

  const numberCompleted = props.total - props.remaining
  return (
    <View style={[styles.container, props.style]}>
      {arr.map((i) => {
        const isActive = i === numberCompleted
        const isPast = i < numberCompleted
        return <Icon key={i} icon={isPast ? CircleInactive : CircleActive} size={font1} color={getColorForDot(isActive, isPast)} />
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
