import React, {useEffect, useState} from 'react'
import {BackHandler, Pressable, StyleSheet} from 'react-native'
import {shadow, sunbeam} from '../styles/colors'
import useDarkMode from '../hooks/useDarkMode'
import {spaceDefault} from '../styles/layout'
import PropTypes from 'prop-types'
import MenuButton from './MenuButton'
import {useDispatch, useSelector} from 'react-redux'
import {Scene_GameResults, Scene_Menu} from '../constants/scenes'
import {goToScene} from '../redux/NavigationSlice'
import UIText from './UIText'
import {SCENE_TO_LABEL} from '../constants/game'
import {selectCurrentScene, selectLastGameResults} from '../redux/selectors'
import Modal from './Modal'
import Icon, {ArrowLeft} from './Icon'
import useSoundPlayer from '../hooks/useSoundPlayer'
import {SOUND_SLAM} from '../lib/SoundHelper'

function InGameMenu(props) {
  const dispatch = useDispatch()
  const isDark = useDarkMode()
  const [isOpen, setIsOpen] = useState(false)
  const {playSound} = useSoundPlayer()
  const currentGame = useSelector(selectCurrentScene)
  const results = useSelector(selectLastGameResults)

  useEffect(() => {
    const backAction = () => {
      setIsOpen((o) => !o)
      return true
    }

    BackHandler.addEventListener('hardwareBackPress', backAction)

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction)
    }
  }, [])

  const handleEndGame = async () => {
    // give the screen a chance to cleanup
    if (typeof props.onEnd === 'function') {
      await props.onEnd()
    }

    if (results.length === 0) {
      dispatch(goToScene(Scene_Menu))
    } else {
      dispatch(goToScene(Scene_GameResults))
    }
  }

  const handleResume = async () => {
    if (typeof props.onResume === 'function') {
      await props.onResume()
    }
    setIsOpen(false)
  }

  return (
    <React.Fragment>
      <Pressable
        style={styles.openIcon}
        onPress={() => {
          playSound(SOUND_SLAM).then()
          setIsOpen(true)
        }}
      >
        <Icon icon={ArrowLeft} color={isDark ? sunbeam : shadow} />
      </Pressable>
      <Modal onClose={handleResume} isOpen={isOpen}>
        <UIText>{SCENE_TO_LABEL[currentGame]}</UIText>
        <MenuButton
          style={styles.button}
          title={'Resume'}
          onPressStart={() => {
            setIsOpen(false)
            if (typeof props.onResume === 'function') {
              props.onResume()
            }
          }}
          size={MenuButton.SIZE_SMALL}
          blurCount={2}
        />
        <MenuButton
          style={styles.button}
          title={'End Game'}
          variant={MenuButton.VARIANT_DESTRUCTIVE}
          onPress={handleEndGame}
          size={MenuButton.SIZE_SMALL}
        />
      </Modal>
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
})

InGameMenu.propTypes = {
  onPause: PropTypes.func,
  onResume: PropTypes.func,
  onEnd: PropTypes.func,
}

export default InGameMenu
