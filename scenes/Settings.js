import React from 'react'
import {View, StyleSheet, Pressable, ScrollView} from 'react-native'
import TitleText from '../components/TitleText'
import {spaceDefault, spaceLarge} from '../styles/layout'
import {font2} from '../styles/typography'
import {dimmedBlue, grey, neonBlue, shadow, sunbeam} from '../styles/colors'
import isDarkMode from '../hooks/isDarkMode'
import SubTitleText from '../components/SubTitleText'
import NumberInput from '../components/NumberInput'
import {useDispatch, useSelector} from 'react-redux'
import {selectGameSettings} from '../redux/selectors'
import {flushFromCache, setAutoSubmitCorrect, setDecimalPlaces, setMinMaxValues, setMuteSounds} from '../redux/SettingsSlice'
import {goToScene} from '../redux/NavigationSlice'
import {Scene_Menu} from '../constants/scenes'
import BooleanInput from '../components/BooleanInput'
import DefaultSettings from '../models/GameSettings'
import UIText from '../components/UIText'
import Icon, {ArrowLeft, VolumeOff, VolumeOn} from '../components/Icon'

const MAX_VALUE = 999999

function Settings() {
  const isDark = isDarkMode()
  const dispatch = useDispatch()

  const settings = useSelector(selectGameSettings)

  const haveSettingsChanged = JSON.stringify(settings) !== JSON.stringify(DefaultSettings)

  const handleResetToDefault = () => {
    dispatch(flushFromCache(DefaultSettings))
  }

  return (
    <View style={styles.window}>
      <ScrollView>
        <View style={styles.innerWindow}>
          <Pressable
            onPress={() => {
              dispatch(goToScene(Scene_Menu))
            }}
          >
            <Icon icon={ArrowLeft} color={isDark ? sunbeam : shadow} />
          </Pressable>
          <TitleText>Settings</TitleText>

          <View style={styles.sectionContainer}>
            {/* <SubTitleText>General</SubTitleText> */}
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
})

export default Settings
