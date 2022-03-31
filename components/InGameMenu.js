import React, {useCallback, useEffect, useState} from 'react'
import {BackHandler, Pressable, StyleSheet, View} from 'react-native'
import {faChevronLeft, faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {black, shadow, sunbeam, white} from '../styles/colors'
import isDarkMode from '../hooks/isDarkMode'
import {FullScreenOverlay} from '../styles/elements'
import {spaceDefault} from '../styles/layout'
import PropTypes from 'prop-types'
import MenuButton from './MenuButton'
import {useDispatch, useSelector} from 'react-redux'
import {Scene_GameResults, Scene_Menu} from '../constants/scenes'
import {goToScene} from '../redux/NavigationSlice'
import UIText from './UIText'
import {font3} from '../styles/typography'
import {getBackgroundColor} from '../lib/utilities'
import {SCENE_TO_LABEL} from '../constants/game'
import {selectCurrentScene, selectLastGameResults} from '../redux/selectors'

function InGameMenu(props) {
  const dispatch = useDispatch()
  const isDark = isDarkMode()
  const [isOpen, setIsOpen] = useState(false)

  const currentGame = useSelector(selectCurrentScene)
  const results = useSelector(selectLastGameResults)

  const backAction = useCallback(() => {
    setIsOpen(!isOpen)
    return true
  }, [isOpen, setIsOpen])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction)

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction)
    }
  }, [backAction])

  const handleEndGame = () => {
    if (results.length === 0) {
      dispatch(goToScene(Scene_Menu))
    } else {
      dispatch(goToScene(Scene_GameResults))
    }
  }

  return (
    <React.Fragment>
      <Pressable style={styles.openIcon} onPress={() => setIsOpen(true)}>
        <FontAwesomeIcon
          icon={faChevronLeft}
          color={isDark ? sunbeam : shadow}
          size={font3}
        />
      </Pressable>
      {isOpen && (
        <View
          style={[
            styles.overlay,
            {backgroundColor: isDark ? sunbeam : shadow},
          ]}>
          <View
            style={[
              styles.menuContainer,
              {backgroundColor: getBackgroundColor(isDark)},
            ]}>
            <UIText>{SCENE_TO_LABEL[currentGame]}</UIText>
            <MenuButton
              style={styles.button}
              title={'Resume'}
              onPress={() => {
                setIsOpen(false)
                if (typeof props.onResume === 'function') {
                  props.onResume()
                }
              }}
              size={MenuButton.SIZE_SMALL}
            />
            <MenuButton
              style={styles.button}
              title={'End Game'}
              variant={MenuButton.VARIANT_DESTRUCTIVE}
              onPress={handleEndGame}
              size={MenuButton.SIZE_SMALL}
            />
          </View>
        </View>
      )}
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  openIcon: {
    position: 'absolute',
    top: spaceDefault,
    left: spaceDefault,
    zIndex: 20,
  },

  button: {
    marginTop: spaceDefault,
  },

  overlay: {
    ...FullScreenOverlay,
    zIndex: 20,
  },

  menuContainer: {
    width: '80%',
    padding: spaceDefault,
    borderRadius: 4,
  },
})

InGameMenu.propTypes = {
  onPause: PropTypes.func,
  onResume: PropTypes.func,
}

export default InGameMenu