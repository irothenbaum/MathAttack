import React from 'react'
import {StyleSheet} from 'react-native'
import {Button} from 'react-native'
import PropTypes from 'prop-types'
import {spaceSmall} from '../styles/layout'
import {white, neonBlue} from '../styles/colors'

function MenuButton(props) {
  return (
    <Button
      style={styles.primary}
      title={props.title}
      onPress={() => {
        props.onPress()
      }}
    />
  )
}

const styles = StyleSheet.create({
  primary: {
    padding: spaceSmall,
    backgroundColor: neonBlue,
    color: white,
  },
})

MenuButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
}

export default MenuButton
