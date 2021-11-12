import React from 'react'
import {Button} from 'react-native'
import PropTypes from 'prop-types'

function MenuButton(props) {
  return <Button title={props.title} onPress={props.onPress} />
}

MenuButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
}

export default MenuButton
