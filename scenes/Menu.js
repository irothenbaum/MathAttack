import React, {useEffect, useState, useRef} from 'react'
import {Animated, View, StyleSheet, Pressable, Easing} from 'react-native'
import MenuButton from '../components/MenuButton'
import {useDispatch, useSelector} from 'react-redux'
import {goToScene} from '../redux/NavigationSlice'
import {startNewGame as startNewClassicGame} from '../redux/GameSlice'
import {startNewGame as startNewMarathonGame} from '../redux/GameSlice'
import {startNewGame as startNewEstimateGame} from '../redux/GameSlice'
import {startNewGame as startNewVersusGame} from '../redux/GameSlice'
import {Scene_GameClassic, Scene_GameEstimate, Scene_GameMarathon, Scene_GameVersus, Scene_Settings} from '../constants/scenes'
import {selectGameSettings} from '../redux/selectors'
import {screenHeight, spaceDefault, spaceLarge} from '../styles/layout'
import {setCurrentGame} from '../redux/GlobalSlice'
import {setAnswer} from '../redux/UISlice'
import NormalText from '../components/NormalText'
import {font1} from '../styles/typography'
import {shadow, sunbeam} from '../styles/colors'
import isDarkMode from '../hooks/isDarkMode'
import {GAME_LABEL_CLASSIC, GAME_LABEL_ESTIMATE, GAME_LABEL_MARATHON, GAME_LABEL_VERSUS, SLAM_ANIMATION_DURATION} from '../constants/game'
import {ScreenContainer} from '../styles/elements'
import TitleTypeform from '../components/TitleTypeform'
import useAnimationStation from '../hooks/useAnimationStation'
import SoundHelper, {SOUND_TAP} from '../lib/SoundHelper'
import Icon, {Classic, Estimate, Marathon, Settings, Versus} from '../components/Icon'

const pjson = require('../package.json')

const initialWaitTime = 1000
const afterSlamWaitTime = 800
const positionAnimationTime = 700

const startingPosition = screenHeight * 0.3

function Menu() {
  const dispatch = useDispatch()
  const settings = useSelector(selectGameSettings)
  const [isWaiting, setIsWaiting] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [topPosition, setTopPosition] = useState(0)
  const logoRef = useRef()
  const isDark = isDarkMode()
  const {animate: animateLogo, animation: logoAnimation} = useAnimationStation()
  const {animate: animatePosition, animation: positionAnimation, isAnimating: isAnimatingPosition} = useAnimationStation()

  useEffect(() => {
    dispatch(setAnswer(''))

    // this is a little hacky, but whatever
    if (global.hasAnimated) {
      setIsReady(true)
      return
    }

    // this schedules the animated steps for the intro graphic
    setTimeout(() => {
      setIsWaiting(false)
      animateLogo(
        SLAM_ANIMATION_DURATION,
        () => {
          if (logoRef.current) {
            logoRef.current.measure((fx, fy, width, height, px, py) => {
              setTopPosition(py)
            })
          }

          setTimeout(() => {
            animatePosition(
              positionAnimationTime,
              () => {
                setIsReady(true)
                global.hasAnimated = true
              },
              Easing.inOut(Easing.back(1.8)),
            )
          }, afterSlamWaitTime)
        },
        Easing.sin,
      )
    }, initialWaitTime)

    return () => {}
  }, [])

  const handlePlayClassic = () => {
    dispatch(startNewClassicGame(settings))
    dispatch(setCurrentGame(Scene_GameClassic))
    dispatch(goToScene(Scene_GameClassic))
  }

  const handlePlayMarathon = () => {
    dispatch(startNewMarathonGame(settings))
    dispatch(setCurrentGame(Scene_GameMarathon))
    dispatch(goToScene(Scene_GameMarathon))
  }

  const handlePlayEstimation = () => {
    dispatch(startNewEstimateGame(settings))
    dispatch(setCurrentGame(Scene_GameEstimate))
    dispatch(goToScene(Scene_GameEstimate))
  }

  const handlePlayVersus = () => {
    dispatch(startNewVersusGame(settings))
    dispatch(setCurrentGame(Scene_GameVersus))
    dispatch(goToScene(Scene_GameVersus))
  }

  return (
    <View style={styles.window}>
      <View style={[styles.innerContainer, {opacity: isReady ? 1 : 0}]}>
        <TitleTypeform style={{alignSelf: 'center', zIndex: 10}} ref={logoRef} />
        <View style={styles.gameButtonContainer}>
          <MenuButton size={MenuButton.SIZE_LARGE} title={GAME_LABEL_CLASSIC} onPress={handlePlayClassic} icon={Classic} blurCount={3} />
        </View>
        <View style={styles.gameButtonContainer}>
          <MenuButton size={MenuButton.SIZE_LARGE} title={GAME_LABEL_MARATHON} onPress={handlePlayMarathon} icon={Marathon} blurCount={3} />
        </View>
        <View style={styles.gameButtonContainer}>
          <MenuButton
            size={MenuButton.SIZE_LARGE}
            title={GAME_LABEL_ESTIMATE}
            onPress={handlePlayEstimation}
            icon={Estimate}
            blurCount={3}
          />
        </View>
        <View style={styles.gameButtonContainer}>
          <MenuButton size={MenuButton.SIZE_LARGE} title={GAME_LABEL_VERSUS} onPress={handlePlayVersus} icon={Versus} blurCount={3} />
        </View>

        <View style={styles.footnoteContainer}>
          <NormalText style={styles.footnote}>v{pjson.version}</NormalText>
          <Pressable
            onPress={() => {
              SoundHelper.playSound(SOUND_TAP).then()
              dispatch(goToScene(Scene_Settings))
            }}
          >
            <Icon icon={Settings} color={isDark ? sunbeam : shadow} />
          </Pressable>
        </View>
      </View>
      {!isReady && (
        <View style={styles.animatedLogoStyles}>
          <Animated.View
            style={[
              {
                top: startingPosition,
                alignSelf: 'center',
              },
              isAnimatingPosition
                ? {
                    top: positionAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [startingPosition, topPosition],
                    }),
                  }
                : undefined,
            ]}
          >
            {!isWaiting && <TitleTypeform animation={logoAnimation} />}
          </Animated.View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  window: {
    ...ScreenContainer,
  },

  innerContainer: {
    ...ScreenContainer,
    paddingBottom: 100,
  },

  title: {
    marginBottom: spaceLarge,
  },

  gameButtonContainer: {
    width: '100%',
    padding: spaceDefault,
  },

  footnoteContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spaceDefault,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  footnote: {
    opacity: 0.5,
    fontSize: font1,
  },

  animatedLogoStyles: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    zIndex: 2,
  },
})

export default Menu
