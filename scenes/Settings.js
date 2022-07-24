import React, {useState} from 'react'
import {Animated, View, StyleSheet, Pressable, ScrollView, useColorScheme} from 'react-native'
import TitleText from '../components/TitleText'
import {spaceDefault, spaceExtraSmall, spaceLarge} from '../styles/layout'
import {font2} from '../styles/typography'
import {dimmedBlue, neonBlue, shadow, sunbeam} from '../styles/colors'
import useDarkMode from '../hooks/useDarkMode'
import NumberInput from '../components/NumberInput'
import {useDispatch, useSelector} from 'react-redux'
import {selectGameSettings} from '../redux/selectors'
import {
  flushFromCache,
  setAutoSubmitCorrect,
  setColorScheme,
  setDecimalPlaces,
  setMinMaxValues,
  setMuteSounds,
} from '../redux/SettingsSlice'
import {goToScene} from '../redux/NavigationSlice'
import {Scene_Menu} from '../constants/scenes'
import BooleanInput from '../components/BooleanInput'
import DefaultSettings from '../models/GameSettings'
import UIText from '../components/UIText'
import Icon, {ArrowLeft, VolumeOff, VolumeOn} from '../components/Icon'
import MenuButton from '../components/MenuButton'
import {COLOR_SCHEME_DARK, COLOR_SCHEME_LIGHT, COLOR_SCHEME_SYSTEM} from '../constants/game'
import useAnimationStation from '../hooks/useAnimationStation'
import {FullScreenOverlay} from '../styles/elements'
import {getBackgroundColor} from '../lib/utilities'
import useBackAction from '../hooks/useBackAction'

const MAX_VALUE = 999999

const colorSchemeLabels = {
  [COLOR_SCHEME_SYSTEM]: 'Auto',
  [COLOR_SCHEME_LIGHT]: 'Light',
  [COLOR_SCHEME_DARK]: 'Dark',
}

const COLOR_SCHEME_CHANGE_DURATION = 1000

function Settings() {
  const isDark = useDarkMode()
  const dispatch = useDispatch()

  const [changingToScheme, setChangingToScheme] = useState(undefined)
  const {animate, animation} = useAnimationStation()
  const changeColorOverlay = {
    [COLOR_SCHEME_SYSTEM]: getBackgroundColor(useColorScheme() === 'dark'),
    [COLOR_SCHEME_DARK]: getBackgroundColor(true),
    [COLOR_SCHEME_LIGHT]: getBackgroundColor(false),
  }

  // setting up the Android Back Behavior
  const backAction = () => {
    dispatch(goToScene(Scene_Menu))
    return true
  }
  useBackAction(backAction)

  const settings = useSelector(selectGameSettings)

  const haveSettingsChanged = JSON.stringify(settings) !== JSON.stringify(DefaultSettings)

  const handleResetToDefault = () => {
    dispatch(flushFromCache(DefaultSettings))
  }

  const handleChangeColorScheme = (nextScheme) => {
    if (nextScheme === settings.colorScheme || typeof changingToScheme === 'number') {
      return
    }

    setChangingToScheme(nextScheme)
    animate(COLOR_SCHEME_CHANGE_DURATION, () => setChangingToScheme(undefined))
    setTimeout(() => {
      dispatch(setColorScheme(nextScheme))
    }, COLOR_SCHEME_CHANGE_DURATION / 2)
    return false
  }

  return (
    <View style={styles.window}>
      {typeof changingToScheme === 'number' && (
        <Animated.View
          style={[
            styles.changeColorSchemeOverlay,
            {
              backgroundColor: changeColorOverlay[changingToScheme],
              opacity: animation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 1, 0],
              }),
            },
          ]}
        />
      )}

      <ScrollView>
        <View style={styles.innerWindow}>
          <Pressable onPress={backAction}>
            <Icon icon={ArrowLeft} color={isDark ? sunbeam : shadow} />
          </Pressable>
          <TitleText>Settings</TitleText>

          <View style={styles.sectionContainer}>
            {/* <SubTitleText>General</SubTitleText> */}
            <View style={[styles.inputRow, styles.row]}>
              {Object.entries(colorSchemeLabels).map(([keyStr, label], index) => {
                const key = parseInt(keyStr)
                const isActiveScheme = typeof changingToScheme === 'number' ? changingToScheme === key : settings.colorScheme === key
                return (
                  <MenuButton
                    key={keyStr}
                    blurCount={isActiveScheme ? 2 : 0}
                    style={index > 0 ? {marginLeft: spaceExtraSmall} : undefined}
                    title={label}
                    variant={isActiveScheme ? MenuButton.VARIANT_DESTRUCTIVE : MenuButton.VARIANT_DEFAULT}
                    onPressStart={() => handleChangeColorScheme(key)}
                  />
                )
              })}
            </View>
            <BooleanInput
              style={styles.inputRow}
              value={settings.muteSounds}
              onChange={(v) => dispatch(setMuteSounds(v))}
              label={'Mute sounds'}
              icon={settings.muteSounds ? VolumeOff : VolumeOn}
            />
            <NumberInput
              style={styles.inputRow}
              label={'Minimum answer value'}
              value={settings.minValue}
              min={0}
              max={MAX_VALUE}
              onChange={(v) => dispatch(setMinMaxValues(v, settings.maxValue))}
            />
            <NumberInput
              style={styles.inputRow}
              label={'Maximum answer value'}
              value={settings.maxValue}
              min={0}
              max={MAX_VALUE}
              onChange={(v) => dispatch(setMinMaxValues(settings.minValue, v))}
            />
            <NumberInput
              style={styles.inputRow}
              label={'Decimal places'}
              max={3}
              min={0}
              value={settings.decimalPlaces}
              onChange={(v) => dispatch(setDecimalPlaces(v))}
            />

            <BooleanInput
              style={styles.inputRow}
              value={settings.autoSubmit}
              onChange={(v) => dispatch(setAutoSubmitCorrect(v))}
              label={'Auto submit answer'}
            />
          </View>

          {/*<View style={styles.sectionContainer}>*/}
          {/*  <SubTitleText>{GAME_LABEL_CLASSIC}</SubTitleText>*/}
          {/*</View>*/}

          {/*<View style={styles.sectionContainer}>*/}
          {/*  <SubTitleText>{GAME_LABEL_MARATHON}</SubTitleText>*/}
          {/*</View>*/}

          {/*<View style={styles.sectionContainer}>*/}
          {/*  <SubTitleText>{GAME_LABEL_ESTIMATE}</SubTitleText>*/}
          {/*</View>*/}

          {haveSettingsChanged && (
            <Pressable onPress={handleResetToDefault}>
              <UIText style={{fontSize: font2, color: isDark ? dimmedBlue : neonBlue}}>Reset to default</UIText>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  window: {
    height: '100%',
    width: '100%',
  },

  innerWindow: {
    padding: spaceDefault,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionContainer: {
    marginBottom: spaceLarge,
    // marginVertical: spaceLarge,
    // borderTopWidth: 1,
    // borderTopColor: grey,
  },

  inputRow: {
    marginTop: spaceDefault,
  },

  changeColorSchemeOverlay: {
    ...FullScreenOverlay,
    zIndex: 1000,
  },
})

export default Settings
