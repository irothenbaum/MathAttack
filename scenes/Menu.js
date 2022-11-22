import React, {useEffect, useState, useRef} from 'react'
import {Animated, View, StyleSheet, Pressable, Easing} from 'react-native'
import MenuButton from '../components/MenuButton'
import {useDispatch} from 'react-redux'
import {goToScene} from '../redux/NavigationSlice'
import {
  Scene_GameClassic,
  Scene_GameCrescendo,
  Scene_GameEstimate,
  Scene_GameMarathon,
  Scene_GameVersus,
  Scene_Settings,
  Scene_HighScores,
  Scene_GameFractions,
} from '../constants/scenes'
import {screenHeight, spaceDefault, spaceSmall} from '../styles/layout'
import {setAnswer} from '../redux/UISlice'
import NormalText from '../components/NormalText'
import {font1} from '../styles/typography'
import {
  GAME_LABEL_CLASSIC,
  GAME_LABEL_CRESCENDO,
  GAME_LABEL_ESTIMATE,
  GAME_LABEL_MARATHON,
  GAME_LABEL_VERSUS,
  SLAM_ANIMATION_DURATION,
  GAME_LABEL_FRACTIONS,
} from '../constants/game'
import {ScreenContainer} from '../styles/elements'
import TitleTypeform from '../components/TitleTypeform'
import useAnimationStation from '../hooks/useAnimationStation'
import {SOUND_TAP} from '../lib/SoundHelper'
import Icon, {HighScores, Classic, Estimate, Marathon, Settings, Versus, Crescendo, Fractions} from '../components/Icon'
import useSoundPlayer from '../hooks/useSoundPlayer'
import useColorsControl from '../hooks/useColorsControl'
import usePlayGame from '../hooks/usePlayGame'
import GameGallery, {GameGalleryItem} from '../components/GameGallery'

const pjson = require('../package.json')

const initialWaitTime = 1000
const afterSlamWaitTime = 800
const positionAnimationTime = 700

const startingPosition = screenHeight * 0.3

function Menu() {
  const dispatch = useDispatch()
  const [isWaiting, setIsWaiting] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [topPosition, setTopPosition] = useState(0)
  const [gameGroup, setGameGroup] = useState(0)
  const logoRef = useRef()
  const {shadow} = useColorsControl()
  const {animate: animateLogo, animation: logoAnimation} = useAnimationStation()
  const {animate: animatePosition, animation: positionAnimation, isAnimating: isAnimatingPosition} = useAnimationStation()
  const {playSound} = useSoundPlayer()

  const {play} = usePlayGame()

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

  return (
    <View style={styles.window}>
      <View style={[styles.innerContainer, {opacity: isReady ? 1 : 0}]}>
        <TitleTypeform style={{alignSelf: 'center', zIndex: 10}} ref={logoRef} />

        <GameGallery titles={['Classic', 'Twist']} style={{flex: 0}} selected={gameGroup} onSelect={setGameGroup}>
          <GameGalleryItem>
            <View style={styles.gameButtonContainer}>
              <MenuButton
                size={MenuButton.SIZE_LARGE}
                title={GAME_LABEL_CLASSIC}
                onPress={() => play(Scene_GameClassic)}
                icon={Classic}
                blurCount={3}
              />
            </View>
            <View style={styles.gameButtonContainer}>
              <MenuButton
                size={MenuButton.SIZE_LARGE}
                title={GAME_LABEL_MARATHON}
                onPress={() => play(Scene_GameMarathon)}
                icon={Marathon}
                blurCount={3}
              />
            </View>
            <View style={styles.gameButtonContainer}>
              <MenuButton
                size={MenuButton.SIZE_LARGE}
                title={GAME_LABEL_VERSUS}
                onPress={() => play(Scene_GameVersus)}
                icon={Versus}
                blurCount={3}
              />
            </View>
          </GameGalleryItem>

          <GameGalleryItem>
            <View style={styles.gameButtonContainer}>
              <MenuButton
                size={MenuButton.SIZE_LARGE}
                title={GAME_LABEL_ESTIMATE}
                onPress={() => play(Scene_GameEstimate)}
                icon={Estimate}
                blurCount={3}
              />
            </View>
            <View style={styles.gameButtonContainer}>
              <MenuButton
                size={MenuButton.SIZE_LARGE}
                title={GAME_LABEL_CRESCENDO}
                onPress={() => play(Scene_GameCrescendo)}
                icon={Crescendo}
                blurCount={3}
              />
            </View>
            <View style={styles.gameButtonContainer}>
              <MenuButton
                size={MenuButton.SIZE_LARGE}
                title={GAME_LABEL_FRACTIONS}
                onPress={() => play(Scene_GameFractions)}
                icon={Fractions}
                blurCount={3}
              />
            </View>
          </GameGalleryItem>
        </GameGallery>

        <View style={styles.footnoteContainer}>
          <NormalText style={styles.footnote}>v{pjson.version}</NormalText>
          <View style={styles.controlsContainer}>
            <Pressable
              onPress={() => {
                playSound(SOUND_TAP).then()
                dispatch(goToScene(Scene_HighScores))
              }}
            >
              <Icon icon={HighScores} color={shadow} style={{marginRight: spaceDefault}} />
            </Pressable>
            <Pressable
              onPress={() => {
                playSound(SOUND_TAP).then()
                dispatch(goToScene(Scene_Settings))
              }}
            >
              <Icon icon={Settings} color={shadow} />
            </Pressable>
          </View>
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

  gameButtonContainer: {
    width: '100%',
    padding: spaceSmall,
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

  controlsContainer: {
    flexDirection: 'row',
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
