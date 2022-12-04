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
import {screenHeight, spaceDefault, spaceExtraLarge, spaceLarge, spaceSmall} from '../styles/layout'
import {setAnswer} from '../redux/UISlice'
import NormalText from '../components/NormalText'
import {font1, font4} from '../styles/typography'
import {SLAM_ANIMATION_DURATION, SCENE_TO_LABEL} from '../constants/game'
import {ScreenContainer} from '../styles/elements'
import TitleTypeform from '../components/TitleTypeform'
import useAnimationStation from '../hooks/useAnimationStation'
import {SOUND_TAP} from '../lib/SoundHelper'
import Icon, {HighScores, Classic, Estimate, Marathon, Settings, Versus, Crescendo, Fractions} from '../components/Icon'
import useSoundPlayer from '../hooks/useSoundPlayer'
import useColorsControl from '../hooks/useColorsControl'
import usePlayGame from '../hooks/usePlayGame'
import Modal from '../components/Modal'
import SubTitleText from '../components/SubTitleText'

const pjson = require('../package.json')

const initialWaitTime = 1000
const afterSlamWaitTime = 800
const positionAnimationTime = 700

const startingPosition = screenHeight * 0.3

const SCENE_TO_DESCRIPTION = {
  [Scene_GameClassic]: 'Race against the clock to solve these simple arithmetic questions before time runs out.',
  [Scene_GameMarathon]:
    "Slow and steady wins the race, but it's three strikes and you're out. See how many of these simple arithmetic questions you can answer correctly.",
  [Scene_GameVersus]: 'Challenge a friend and see whose brain calculator is faster.',
  [Scene_GameEstimate]:
    "You won't have enough time to calculate exactly, but see how well you can estimate the right answer before time runs out.",
  [Scene_GameCrescendo]:
    "There's many paths, but only one leads you to the right answer. See if you can calculate the correct combination of terms.",
  [Scene_GameFractions]:
    "Practice converting fractions into decimal form with this unique math game. The closer you are to the correct answer, the more points you'll earn.",
}

const SCENE_TO_ICON = {
  [Scene_GameClassic]: Classic,
  [Scene_GameMarathon]: Marathon,
  [Scene_GameVersus]: Versus,
  [Scene_GameEstimate]: Estimate,
  [Scene_GameCrescendo]: Crescendo,
  [Scene_GameFractions]: Fractions,
}

function Menu() {
  const dispatch = useDispatch()
  const [isWaiting, setIsWaiting] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [topPosition, setTopPosition] = useState(0)
  const [preparePlay, setPreparePlay] = useState(undefined)
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
              setTopPosition(py - global._SafeAreaInsets.top)
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
      <Modal isOpen={!!preparePlay} onClose={() => setPreparePlay(undefined)}>
        <View style={{padding: spaceSmall}}>
          <SubTitleText>{SCENE_TO_LABEL[preparePlay]}</SubTitleText>
          <NormalText>{SCENE_TO_DESCRIPTION[preparePlay]}</NormalText>

          <MenuButton
            style={styles.playGameButton}
            blurCount={3}
            icon={SCENE_TO_ICON[preparePlay]}
            onPress={() => play(preparePlay)}
            title={`Play ${SCENE_TO_LABEL[preparePlay]}`}
          />
        </View>
      </Modal>

      <View style={[styles.innerContainer, {opacity: isReady ? 1 : 0}]}>
        <TitleTypeform style={{alignSelf: 'center', zIndex: 10, marginBottom: spaceExtraLarge}} ref={logoRef} />
        <View style={styles.galleryRow}>
          <View style={styles.gameButtonContainer}>
            <MenuButton
              size={MenuButton.SIZE_X_LARGE}
              buttonStyle={styles.gameButton}
              onPressStart={() => setPreparePlay(Scene_GameClassic)}
              variant={MenuButton.VARIANT_INVERSE}
              icon={Classic}
              blurCount={3}
            />
          </View>
          <View style={styles.gameButtonContainer}>
            <MenuButton
              size={MenuButton.SIZE_X_LARGE}
              buttonStyle={styles.gameButton}
              onPressStart={() => setPreparePlay(Scene_GameMarathon)}
              variant={MenuButton.VARIANT_INVERSE}
              icon={Marathon}
              blurCount={3}
            />
          </View>
          <View style={styles.gameButtonContainer}>
            <MenuButton
              size={MenuButton.SIZE_X_LARGE}
              buttonStyle={styles.gameButton}
              onPressStart={() => setPreparePlay(Scene_GameVersus)}
              variant={MenuButton.VARIANT_INVERSE}
              icon={Versus}
              blurCount={3}
            />
          </View>
        </View>
        <View style={styles.galleryRow}>
          <View style={styles.gameButtonContainer}>
            <MenuButton
              size={MenuButton.SIZE_X_LARGE}
              buttonStyle={styles.gameButton}
              onPressStart={() => setPreparePlay(Scene_GameEstimate)}
              variant={MenuButton.VARIANT_INVERSE}
              icon={Estimate}
              blurCount={3}
            />
          </View>
          <View style={styles.gameButtonContainer}>
            <MenuButton
              size={MenuButton.SIZE_X_LARGE}
              buttonStyle={styles.gameButton}
              onPressStart={() => setPreparePlay(Scene_GameCrescendo)}
              variant={MenuButton.VARIANT_INVERSE}
              icon={Crescendo}
              blurCount={3}
            />
          </View>
          <View style={styles.gameButtonContainer}>
            <MenuButton
              size={MenuButton.SIZE_X_LARGE}
              buttonStyle={styles.gameButton}
              onPressStart={() => setPreparePlay(Scene_GameFractions)}
              variant={MenuButton.VARIANT_INVERSE}
              icon={Fractions}
              blurCount={3}
            />
          </View>
        </View>

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

  playGameButton: {
    marginTop: spaceLarge,
  },

  galleryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  gameButton: {
    paddingVertical: spaceDefault,
  },

  gameButtonContainer: {
    padding: spaceSmall,
    flex: 1,
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
