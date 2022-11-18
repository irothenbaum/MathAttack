import {LinearGradient, Svg, Defs, Stop, Rect} from 'react-native-svg'
import React from 'react'
import {View, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import useColorsControl from '../hooks/useColorsControl'

function TopShadow(props) {
  const {foreground} = useColorsControl()

  return (
    <View style={props.style}>
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0" stopColor={foreground} stopOpacity={0.4} />
            <Stop offset="0.2" stopColor={foreground} stopOpacity={0.1} />
            <Stop offset="1" stopColor={foreground} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grad)" />
      </Svg>
    </View>
  )
}

TopShadow.propTypes = {
  style: PropTypes.any,
  opacity: PropTypes.number,
}

export default TopShadow
