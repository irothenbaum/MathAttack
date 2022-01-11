import React from 'react'
import {View, Text, StyleSheet, Pressable, ScrollView} from 'react-native'
import TitleText from '../components/TitleText'
import {spaceDefault, spaceLarge, spaceSmall} from '../styles/layout'
import {font3} from '../styles/typography'
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import {grey, shadow, sunbeam} from '../styles/colors'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import isDarkMode from '../hooks/isDarkMode'
import SubTitleText from '../components/SubTitleText'
import NumberInput from '../components/NumberInput'
import {useDispatch, useSelector} from 'react-redux'
import {selectGameSettings} from '../redux/selectors'
import {setDecimalPlaces, setMinMaxValues} from '../redux/SettingsSlice'
import {goToScene} from '../redux/NavigationSlice'
import {Scene_Menu} from '../constants/scenes'
import {
  GAME_LABEL_CLASSIC,
  GAME_LABEL_ESTIMATE,
  GAME_LABEL_MARATHON,
} from '../constants/game'

const MAX_VALUE = 999999

function Settings() {
  const isDark = isDarkMode()
  const dispatch = useDispatch()

  const settings = useSelector(selectGameSettings)

  return (
    <View style={styles.window}>
      <ScrollView>
        <View style={styles.innerWindow}>
          <Pressable
            onPress={() => {
              dispatch(goToScene(Scene_Menu))
            }}>
            <FontAwesomeIcon
              size={font3}
              icon={faChevronLeft}
              color={isDark ? sunbeam : shadow}
            />
          </Pressable>
          <TitleText>Settings</TitleText>

          <View style={styles.sectionContainer}>
            <SubTitleText>General</SubTitleText>
            <NumberInput
              label={'Minimum answer value'}
              value={settings.minValue}
              min={-1 * MAX_VALUE}
              max={MAX_VALUE}
              onChange={v => dispatch(setMinMaxValues(v, settings.maxValue))}
            />
            <NumberInput
              label={'Maximum answer value'}
              value={settings.maxValue}
              min={-1 * MAX_VALUE}
              max={MAX_VALUE}
              onChange={v => dispatch(setMinMaxValues(settings.minValue, v))}
            />
            <NumberInput
              label={'Decimal places'}
              max={3}
              min={0}
              value={settings.decimalPlaces}
              onChange={v => dispatch(setDecimalPlaces(v))}
            />
          </View>

          <View style={styles.sectionContainer}>
            <SubTitleText>{GAME_LABEL_CLASSIC}</SubTitleText>
          </View>

          <View style={styles.sectionContainer}>
            <SubTitleText>{GAME_LABEL_MARATHON}</SubTitleText>
          </View>

          <View style={styles.sectionContainer}>
            <SubTitleText>{GAME_LABEL_ESTIMATE}</SubTitleText>
          </View>
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
    marginVertical: spaceLarge,
    paddingTop: spaceDefault,
    borderTopWidth: 1,
    borderTopColor: grey,
  },
})

export default Settings
