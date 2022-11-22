import React, {useState} from 'react'
import {StyleSheet, View, Pressable} from 'react-native'
import TitleText from '../components/TitleText'
import {spaceDefault, spaceExtraSmall, spaceSmall} from '../styles/layout'
import {
  Scene_GameClassic,
  Scene_GameCrescendo,
  Scene_GameEstimate,
  Scene_GameFractions,
  Scene_GameMarathon,
  Scene_Menu,
} from '../constants/scenes'
import {SCENE_TO_LABEL} from '../constants/game'
import HighScoresTable from '../components/Scoring/HighScoresTable'
import SubTitleText from '../components/SubTitleText'
import Icon, {ArrowLeft, Classic, Crescendo, Estimate, Fractions, Marathon} from '../components/Icon'
import {goToScene} from '../redux/NavigationSlice'
import useBackAction from '../hooks/useBackAction'
import useColorsControl from '../hooks/useColorsControl'
import {useDispatch} from 'react-redux'
import TopShadow from '../components/TopShadow'
import SingleGameResultBottomPanel from '../components/Scoring/SingleGameResultBottomPanel'

const GamesMap = {
  [Scene_GameClassic]: Classic,
  [Scene_GameMarathon]: Marathon,
  [Scene_GameEstimate]: Estimate,
  [Scene_GameCrescendo]: Crescendo,
  [Scene_GameFractions]: Fractions,
}

function HighScores() {
  const {shadow, red, foreground, background} = useColorsControl()
  const dispatch = useDispatch()
  const [game, setGame] = useState(Scene_GameClassic)

  // setting up the Android Back Behavior
  const backAction = () => {
    dispatch(goToScene(Scene_Menu))
    return true
  }
  useBackAction(backAction)

  return (
    <View style={styles.window}>
      <View style={styles.innerWindow}>
        <Pressable onPress={backAction}>
          <Icon icon={ArrowLeft} color={shadow} />
        </Pressable>
        <SubTitleText style={{marginTop: spaceSmall}}>High Scores</SubTitleText>
      </View>
      <View style={{paddingLeft: spaceDefault, paddingBottom: spaceExtraSmall, backgroundColor: red}}>
        <TitleText style={{color: background}}>{SCENE_TO_LABEL[game]}</TitleText>
      </View>
      <View style={[styles.gamesContainer, {borderColor: shadow}]}>
        {Object.keys(GamesMap).map((key) => (
          <Pressable onPress={() => setGame(key)} style={[styles.icon, game === key ? {backgroundColor: red} : null]} key={key}>
            <Icon icon={GamesMap[key]} color={game === key ? background : foreground} />
          </Pressable>
        ))}
      </View>
      <View style={{flex: 1, zIndex: 10}}>
        <TopShadow style={styles.shadow} />
        <HighScoresTable game={game} />
      </View>

      <SingleGameResultBottomPanel />
    </View>
  )
}

const styles = StyleSheet.create({
  window: {
    height: '100%',
    width: '100%',
  },

  shadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 6,
    width: '100%',
  },

  innerWindow: {
    padding: spaceDefault,
  },

  icon: {
    paddingVertical: spaceSmall,
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },

  gamesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
})

export default HighScores
