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
    // correct path is in array that stores the expected path of terms as elements in the order they appear in the equation
    const correctPath = []
    // we inc by 2 to skip over the operators (as they'll be included in he correct path elements)
    for (let i = 0; i < numbersAndOperators.length; i += 2) {
      correctPath.push(termToStr({operation: numbersAndOperators[i], term: numbersAndOperators[i + 1]}))
    }

    // we then determine how many total fakes (for all steps in the path) we need to make on this level/difficulty)
    let fakesToMake = Math.max(0, props.difficulty - correctPath.length)
    const maxFakesPerRow = getMaxFakesForRound(props.difficulty)

    const s = [...correctPath]
      // we do reverse so the later terms have the most fakes
      .reverse()
      .map((correctTermOnThisStep, i) => {
        const fakesOnThisRow = Math.min(maxFakesPerRow, fakesToMake)
        // we always render the correct term so we initialize our terms array with that
        const termsToRender = [correctTermOnThisStep]

        // if we expect to make at least 1 fake term alongside the correct term
        if (fakesOnThisRow > 0) {
          // here we generate an array of fake of terms
          // we used to do this with a simple map, but we want to make sure we don't duplicate any fake values
          // so we need to be able to reference the array of existing terms (hence storing it to the array as we go)
          for (let count = 0; count < fakesOnThisRow; count++) {
            let termStr
            let iter = 0
            do {
              const eq = Equation.getRandomFromSettings(gameSettings)
              termStr = termToStr({term: eq.phrase.term2, operation: eq.phrase.operation})
              iter++
              // we'll try up to 10 times before just using what we got
            } while (termsToRender.includes(termStr) && iter < 10)
            termsToRender.push(termStr)
          }
        }

        // deduce the number we created from the total we determined to make earlier
        fakesToMake -= fakesOnThisRow

        // shuffle so the correct term may not be the first element every time
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
