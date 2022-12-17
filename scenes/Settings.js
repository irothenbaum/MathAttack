import React, {useState} from 'react'
import {Alert, Animated, View, StyleSheet, Pressable, ScrollView, useColorScheme} from 'react-native'
import TitleText from '../components/TitleText'
import {spaceDefault, spaceExtraLarge, spaceExtraSmall, spaceLarge} from '../styles/layout'
import {font2, smallText} from '../styles/typography'
import NumberInput from '../components/NumberInput'
import {useDispatch, useSelector} from 'react-redux'
import {selectGameSettings} from '../redux/selectors'
import {
  hydrateFromCache,
  setAllowNegative,
  setAutoSubmitCorrect,
  setColorScheme,
  setDecimalPlaces,
  setDisableVibration,
  setEquationDuration,
  setMinMaxValues,
  setMuteSounds,
  setDailyChallengeTime,
} from '../redux/SettingsSlice'
import {goToScene} from '../redux/NavigationSlice'
import {Scene_Menu} from '../constants/scenes'
import BooleanInput from '../components/BooleanInput'
import DefaultSettings from '../models/GameSettings'
import UIText from '../components/UIText'
import Icon, {
  X,
  DailyChallenge,
  ArrowLeft,
  OperationAdd,
  OperationSubtract,
  VibrateOff,
  VibrateOn,
  VolumeOff,
  VolumeOn,
} from '../components/Icon'
import MenuButton from '../components/MenuButton'
import {
  ALL_GAMES,
  COLOR_SCHEME_DARK,
  COLOR_SCHEME_LIGHT,
  COLOR_SCHEME_SYSTEM,
  DEFAULT_DAILY_CHALLENGE_TIME,
  MAX_DECIMALS,
} from '../constants/game'
import useAnimationStation from '../hooks/useAnimationStation'
import {FullScreenOverlay} from '../styles/elements'
import {getBackgroundColor} from '../lib/utilities'
import useBackAction from '../hooks/useBackAction'
import useColorsControl from '../hooks/useColorsControl'
import {clearHighScores} from '../redux/HighScoresSlice'
import NormalText from '../components/NormalText'
import NotificationHelper from '../lib/NotificationHelper'

const MAX_VALUE = 999999

const colorSchemeLabels = {
  [COLOR_SCHEME_SYSTEM]: 'Auto',
  [COLOR_SCHEME_LIGHT]: 'Light',
  [COLOR_SCHEME_DARK]: 'Dark',
}

const COLOR_SCHEME_CHANGE_DURATION = 1000

function Settings() {
  const {blue, shadow, red, background} = useColorsControl()
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
    dispatch(hydrateFromCache(DefaultSettings))
  }

  const handleResetHighScores = (confirmed) => {
    if (!confirmed) {
      Alert.alert('Are you sure?', 'This will erase all high scores saved on this device.', [
        {
          text: 'Yes, clear scores',
          onPress: () => handleResetHighScores(true),
        },
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
      ])

      return
    }

    ALL_GAMES.forEach((game) => dispatch(clearHighScores(game)))

    Alert.alert(null, 'High scores cleared!')
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

  const handleChangeDailyChallengeToggle = (isActive) => {
    if (isActive) {
      NotificationHelper.Instance()
        .requestPermissions()
        .then(() => {
          dispatch(setDailyChallengeTime(DEFAULT_DAILY_CHALLENGE_TIME))
        })
    } else {
      dispatch(setDailyChallengeTime(false))
    }
  }

  const isDailyChallengeEnabled = typeof settings.dailyChallengeTime === 'number'

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
            <Icon icon={ArrowLeft} color={shadow} />
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
              value={!settings.muteSounds}
              onChange={(v) => dispatch(setMuteSounds(!v))}
              label={'Sounds ' + (settings.muteSounds ? 'muted' : 'on')}
              icon={settings.muteSounds ? VolumeOff : VolumeOn}
            />
            <BooleanInput
              style={styles.inputRow}
              value={!settings.disableVibration}
              onChange={(v) => dispatch(setDisableVibration(!v))}
              label={'Vibration ' + (settings.disableVibration ? 'off' : 'on')}
              icon={settings.disableVibration ? VibrateOff : VibrateOn}
            />
            <NumberInput
              style={styles.inputRow}
              label={'Minimum answer value'}
              value={settings.minValue}
              min={0}
              max={settings.maxValue}
              onChange={(v) => dispatch(setMinMaxValues(v, settings.maxValue))}
            />
            <NumberInput
              style={styles.inputRow}
              label={'Maximum answer value'}
              value={settings.maxValue}
              min={settings.minValue + 10 /* require at least 10 point difference between min and max */}
              max={MAX_VALUE}
              onChange={(v) => dispatch(setMinMaxValues(settings.minValue, v))}
            />
            <BooleanInput
              style={styles.inputRow}
              value={settings.allowNegative}
              onChange={(v) => dispatch(setAllowNegative(v))}
              label={settings.allowNegative ? 'Allow negatives' : 'Positives only'}
              icon={settings.allowNegative ? OperationSubtract : OperationAdd}
            />
            <NumberInput
              style={styles.inputRow}
              label={'Decimal places'}
              max={MAX_DECIMALS}
              min={0}
              value={settings.decimalPlaces}
              onChange={(v) => dispatch(setDecimalPlaces(v))}
            />

            <NumberInput
              style={styles.inputRow}
              label={'Time to answer'}
              max={15}
              min={3}
              value={settings.equationDuration}
              onChange={(v) => dispatch(setEquationDuration(v))}
            />

            <BooleanInput
              style={styles.inputRow}
              value={settings.autoSubmit}
              onChange={(v) => dispatch(setAutoSubmitCorrect(v))}
              label={settings.autoSubmit ? 'Auto submit answer' : 'Must click to submit'}
            />

            <BooleanInput
              style={styles.inputRow}
              value={isDailyChallengeEnabled}
              onChange={handleChangeDailyChallengeToggle}
              icon={isDailyChallengeEnabled ? DailyChallenge : X}
              label={settings.autoSubmit ? 'Daily Challenge' : 'Must click to submit'}
            />

            {isDailyChallengeEnabled && (
              <View style={styles.inputRow}>
                <NumberInput value={settings.dailyChallengeTime} onChange={(v) => dispatch(setDailyChallengeTime(v))} />
                <NormalText style={styles.subText}>The time of day to receive the daily challenge</NormalText>
              </View>
            )}
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
              <UIText style={{fontSize: font2, color: blue}}>Reset to default</UIText>
            </Pressable>
          )}
        </View>
        <Pressable onPress={() => handleResetHighScores()}>
          <View style={[styles.destructiveContainer, {backgroundColor: red}]}>
            <UIText style={{fontSize: font2, color: background}}>Clear high scores</UIText>
          </View>
        </Pressable>
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

  subText: {
    ...smallText,
  },

  destructiveContainer: {
    marginTop: spaceExtraLarge,
    padding: spaceDefault,
  },
})

export default Settings
