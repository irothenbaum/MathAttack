import React, {useEffect, useRef, useState} from 'react'
import {Animated, View, StyleSheet, Pressable} from 'react-native'
import Equation from '../models/Equation'
import UIText from './UIText'
import {spaceExtraLarge, spaceLarge, spaceSmall} from '../styles/layout'
import PhraseBuffer from '../models/PhraseBuffer'
import Phrase from '../models/Phrase'
import PropTypes from 'prop-types'
import {selectGameSettings} from '../redux/selectors'
import {useSelector} from 'react-redux'
import {ANSWER_TIMEOUT} from '../constants/game'
import {fadeColor, getScreenPositionFromLayoutEvent, selectRandom, termStrToTerm} from '../lib/utilities'
import Svg, {Line} from 'react-native-svg'
import useColorsControl from '../hooks/useColorsControl'
import useAnimationStation from '../hooks/useAnimationStation'
import useSoundPlayer from '../hooks/useSoundPlayer'
import {SOUND_TAP} from '../lib/SoundHelper'
import CrescendoRow from './CrescendoRow'

/**
 * @param {{term: number, operation: string}} t
 * @returns {string}
 */
function termToStr(t) {
  return `${t.operation}:${t.term}`
}

/**
 * @param {Array<*>} comps
 * @returns {Array<*>}
 */
function shuffleArray(comps) {
  for (let i = 0; i < comps.length; i++) {
    let randomIndex = selectRandom(comps.length)
    if (randomIndex !== i) {
      const temp = comps[randomIndex]
      comps[randomIndex] = comps[i]
      comps[i] = temp
    }
  }
  return comps
}

// ---------------------------------------------------------------------

const LINE_WIDTH = 6
const PULSE_SPEED = 1000

/**
 * @param {string} termStr
 * @param {number} index
 */
function termPositionKey(termStr, index) {
  return `${index},${termStr}`
}

function CrescendoInterface(props) {
  const termPositions = useRef({})
  const [selectedTerms, setSelectedTerms] = useState([])
  const answerPosition = useRef({})
  const firstTermPosition = useRef({})
  const gameSettings = useSelector(selectGameSettings)
  const {loop: loopPulse, cancel: cancelPulse, animation: pulseAnimation} = useAnimationStation()
  const {playSound} = useSoundPlayer()

  const numbersAndOperators = Equation.getLeftSideInfixNotation(props.equation)
  const answer = Equation.getSolution(props.equation)
  const [stepsToRender, setStepsToRender] = useState([])
  const [correctTerms, setCorrectTerms] = useState([])
  const {getResultColor, shadow, backgroundTint, background, red, green} = useColorsControl()

  // we shift off the first term, and then the rest are the paths in groups of 2
  const firstTerm = numbersAndOperators.shift()

  // Equation change effect
  useEffect(() => {
    const correctPath = []
    for (let i = 0; i < numbersAndOperators.length; i += 2) {
      correctPath.push(termToStr({operation: numbersAndOperators[i], term: numbersAndOperators[i + 1]}))
    }

    let fakesToMake = Math.max(0, props.difficulty - correctPath.length)
    const maxFakesPerRow = getMaxFakesForRound(props.difficulty)

    const s = [...correctPath]
      // we do reverse so the later terms have the most fakes
      .reverse()
      .map((t, i) => {
        const fakesOnThisRow = Math.min(maxFakesPerRow, fakesToMake)
        const termsToRender = [t]
        if (fakesOnThisRow > 0) {
          termsToRender.push(
            ...[...new Array(fakesOnThisRow)].map(() => {
              let termStr
              do {
                const eq = Equation.getRandomFromSettings(gameSettings)
                termStr = termToStr({term: eq.phrase.term2, operation: eq.phrase.operation})
              } while (termStr === t)
              return termStr
            }),
          )
        }

        fakesToMake -= fakesOnThisRow

        return shuffleArray(termsToRender)
      })
      // but need to reverse back so the order is maintained
      .reverse()

    setCorrectTerms(correctPath)
    setStepsToRender(s)

    // reset selections
    setSelectedTerms([])
  }, [props.equation])

  useEffect(() => {
    if (selectedTerms.length > 0 && selectedTerms.length === stepsToRender.length) {
      loopPulse(PULSE_SPEED)
      // Disabling AUTO SUBMIT for now
      if (false && gameSettings.autoSubmit) {
        handleGuessPath()
      }
    } else {
      cancelPulse()
    }
  }, [selectedTerms])

  /**
   * @param {number} stepIndex
   * @param {string} termStr
   * @param {{x: number, y:number}} screenPosition
   */
  const handleClickTerm = (stepIndex, termStr, screenPosition) => {
    // must click them in order
    if (stepIndex > selectedTerms.length) {
      return
    }

    // do nothing if it's already selected
    if (selectedTerms[stepIndex] === termStr) {
      return
    }

    playSound(SOUND_TAP).then()

    const newSelectedTerms = [...selectedTerms]
    newSelectedTerms[stepIndex] = termStr
    setSelectedTerms(newSelectedTerms)
  }

  const handleGuessPath = () => {
    if (selectedTerms.length < stepsToRender.length) {
      // have not selected enough terms yet
      return
    }

    let phraseBuffer = new PhraseBuffer()
    phraseBuffer.addTerm(firstTerm)
    selectedTerms.forEach((termStr) => {
      const {term: t, operation: o} = termStrToTerm(termStr)
      phraseBuffer.addTerm(t, o)
    })

    try {
      const phrase = phraseBuffer.toPhrase()
      const a = Phrase.getSolution(phrase)
      props.onSubmitAnswer(a)
    } catch (err) {
      props.onSubmitAnswer(ANSWER_TIMEOUT)
    }
  }

  const termsToDrawLinesBetween = props.isShowingResult ? correctTerms : selectedTerms
  const termLinesToDraw = termsToDrawLinesBetween.map((t, i) => termPositions.current[termPositionKey(t, i)])
  const finalTermPosition =
    termPositions.current[termPositionKey(termsToDrawLinesBetween[termsToDrawLinesBetween.length - 1], termsToDrawLinesBetween.length - 1)]

  const LINE_COLOR = props.isShowingResult ? getResultColor(props.isResultCorrect) : shadow

  return (
    <View style={styles.container}>
      <View style={styles.effectsContainer}>
        <Svg>
          {termLinesToDraw.map((thisPos, index) => {
            const prevPos = index === 0 ? firstTermPosition.current : termLinesToDraw[index - 1]
            return (
              <Line
                key={`(${prevPos.x},${prevPos.y})->(${thisPos.x},${thisPos.y})`}
                x1={prevPos.x}
                y1={prevPos.y}
                x2={thisPos.x}
                y2={thisPos.y}
                stroke={LINE_COLOR}
                strokeWidth={LINE_WIDTH}
              />
            )
          })}
          {props.isShowingResult && (
            <Line
              x1={finalTermPosition.x}
              y1={finalTermPosition.y}
              x2={answerPosition.current.x}
              y2={answerPosition.current.y}
              stroke={LINE_COLOR}
              strokeWidth={LINE_WIDTH}
            />
          )}
        </Svg>
      </View>
      <View
        style={styles.firstTermContainer}
        onLayout={(e) => getScreenPositionFromLayoutEvent(e).then((pos) => (firstTermPosition.current = pos))}
      >
        <View
          style={[
            styles.staticTermCircle,
            {borderColor: props.isResultCorrect ? getResultColor(props.isResultCorrect) : green, backgroundColor: background},
          ]}
        >
          <UIText>{firstTerm}</UIText>
        </View>
      </View>
      <View style={styles.pathsContainer}>
        {stepsToRender.map((termsArr, stepIndex) => (
          <CrescendoRow
            correctTerm={correctTerms[stepIndex]}
            termsArr={termsArr}
            key={`terms-row-${stepIndex}-${termsArr.join()}`}
            isTermSelected={(term) => selectedTerms[stepIndex] === term}
            onRenderedTerm={(screenPos, term) => (termPositions.current[termPositionKey(term, stepIndex)] = screenPos)}
            onPressTerm={(term) => handleClickTerm(stepIndex, term)}
            showTip={stepIndex === selectedTerms.length}
            isDisabled={stepIndex !== selectedTerms.length}
            resultAnimation={props.resultAnimation}
            isShowingResult={props.isShowingResult}
            isResultCorrect={props.isResultCorrect}
          />
        ))}
      </View>
      <View style={styles.answerContainer}>
        <Pressable onPress={handleGuessPath}>
          <Animated.View
            style={[
              styles.staticTermCircle,
              {
                borderColor: props.isShowingResult
                  ? getResultColor(props.isResultCorrect)
                  : selectedTerms.length === stepsToRender.length
                  ? pulseAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [green, fadeColor(green, 0.1), green],
                    })
                  : backgroundTint,
                backgroundColor: background,
              },
            ]}
            onLayout={(e) => getScreenPositionFromLayoutEvent(e).then((pos) => (answerPosition.current = pos))}
          >
            <UIText>{answer}</UIText>
          </Animated.View>
        </Pressable>
      </View>
    </View>
  )
}

const centerFlex = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
}

const styles = StyleSheet.create({
  container: {
    ...centerFlex,
    height: '100%',
  },

  effectsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },

  highlightedTermsRow: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },

  answerContainer: {
    ...centerFlex,
    flex: 0,
    marginVertical: spaceLarge,
  },

  pathsContainer: {
    ...centerFlex,
  },

  firstTermContainer: {
    ...centerFlex,
    flex: 0,
    marginVertical: spaceLarge,
  },

  staticTermCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

CrescendoInterface.propTypes = {
  equation: PropTypes.any,
  difficulty: PropTypes.number,
  onSubmitAnswer: PropTypes.func,
  isShowingResult: PropTypes.bool,
  isResultCorrect: PropTypes.bool,
  resultAnimation: PropTypes.instanceOf(Animated.Value),
  equationTimer: PropTypes.instanceOf(Animated.Value),
}

export default CrescendoInterface

/**
 * @param {number} roundNumber
 * @return {number}
 */
export function getMaxFakesForRound(roundNumber) {
  return roundNumber < 10 ? 2 : 3
}
