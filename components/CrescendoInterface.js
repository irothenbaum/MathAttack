import React, {useEffect, useRef, useState} from 'react'
import {Animated, View, StyleSheet, Pressable} from 'react-native'
import Equation from '../models/Equation'
import UIText from './UIText'
import {spaceExtraLarge, spaceSmall} from '../styles/layout'
import useDarkMode from '../hooks/useDarkMode'
import PhraseBuffer from '../models/PhraseBuffer'
import Phrase from '../models/Phrase'
import PropTypes from 'prop-types'
import {selectGameSettings} from '../redux/selectors'
import {useSelector} from 'react-redux'
import {ANSWER_TIMEOUT} from '../constants/game'
import {RoundBox} from '../styles/elements'
import {getFlashStylesForAnimation, getResultColor, getUIColor} from '../lib/utilities'
import Svg, {Circle, Line} from 'react-native-svg'
import {shadow, sunbeam} from '../styles/colors'

/**
 * @param {*} e
 * @returns {Promise<{x: number, y: number}>}
 */
function getScreenPositionFromLayoutEvent(e) {
  return new Promise((resolve, reject) => {
    e.target.measure((x, y, width, height, pageX, pageY) => {
      resolve({
        x: x + pageX + width / 2,
        y: y + pageY + height / 2,
      })
    })
  })
}

/**
 * @param {{term: number, operation: string}} t
 * @returns {string}
 */
function termToStr(t) {
  return `${t.operation}:${t.term}`
}

/**
 * @param {string} str
 * @returns {{term: number, operation: string}}
 */
function termStrToTerm(str) {
  const parts = str.split(':')
  return {operation: parts[0], term: parseFloat(parts[1])}
}

// ---------------------------------------------------------------------

function Term(props) {
  const {operation, term} = termStrToTerm(props.termStr)
  const screenPosition = useRef({})
  const isDark = useDarkMode()

  const handleLayout = (e) => getScreenPositionFromLayoutEvent(e).then((pos) => (screenPosition.current = pos))

  return (
    <Pressable onPress={() => props.onPress(screenPosition.current)}>
      <View
        style={[
          styles.singleTermContainer,
          {borderColor: getUIColor(isDark), backgroundColor: props.isSelected ? getResultColor(true, isDark) : undefined},
        ]}
        onLayout={handleLayout}
      >
        {props.children}
        <UIText style={{zIndex: 2}}>
          {operation} {term}
        </UIText>
      </View>
    </Pressable>
  )
}

Term.propTypes = {
  termStr: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
}

/**
 * @param {Array<*>} comps
 * @returns {Array<*>}
 */
function shuffleArray(comps) {
  for (let i = 0; i < comps.length; i++) {
    let randomIndex = Math.floor(Math.random() * comps.length)
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

function CrescendoInterface(props) {
  const [selectedTerms, setSelectedTerms] = useState([])
  const [selectedTermLines, setSelectedTermLines] = useState([])
  const answerPosition = useRef({})
  const firstTermPosition = useRef({})
  const gameSettings = useSelector(selectGameSettings)

  // TODO: the order is backwards? I'm not sure what's going on but it seems to be upside down
  const numbersAndOperators = Equation.getLeftSideInfixNotation(props.equation)
  const answer = Equation.getSolution(props.equation)
  const [stepsToRender, setStepsToRender] = useState([])
  const [correctTerms, setCorrectTerms] = useState([])
  const isDark = useDarkMode()

  // we shift off the first term, and then the rest are the paths in groups of 2
  const firstTerm = numbersAndOperators.shift()

  useEffect(() => {
    console.log('use effect: ', numbersAndOperators)
    const correctPath = []
    for (let i = 0; i < numbersAndOperators.length; i += 2) {
      correctPath.push(termToStr({operation: numbersAndOperators[i], term: numbersAndOperators[i + 1]}))
    }

    let fakesToMake = Math.max(0, props.difficulty - correctPath.length)
    const maxFakesPerRow = getMaxFakesForRound(props.difficulty)

    console.log(`Making ${fakesToMake} with ${maxFakesPerRow} per row`)

    const s = [...correctPath]
      // we do reverse so the later terms have the most fakes
      .reverse()
      .map((t, i) => {
        const fakesOnThisRow = Math.min(maxFakesPerRow, fakesToMake)
        const termsToRender = [t]
        if (fakesOnThisRow > 0) {
          console.log(`Making ${fakesOnThisRow} fakes on this row`)
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
    setSelectedTermLines([])
  }, [props.equation])

  useEffect(() => {
    if (selectedTerms.length > 0 && selectedTerms.length === stepsToRender.length && gameSettings.autoSubmit) {
      console.log('AUTO SUBMITTING')
      handleGuessPath()
    }
  }, [selectedTerms])

  /**
   * @param {number} stepIndex
   * @param {string} termStr
   * @param {{x: number, y:number}} screenPosition
   */
  const handleClickTerm = (stepIndex, termStr, screenPosition) => {
    console.log(`CLICKED TERM ${termStr} - ${stepIndex}`)

    // must click them in order
    if (stepIndex > selectedTerms.length) {
      return
    }

    // do nothing if it's already selected
    if (selectedTerms[stepIndex] === termStr) {
      return
    }

    const newSelectedTerms = [...selectedTerms]
    newSelectedTerms[stepIndex] = termStr
    setSelectedTerms(newSelectedTerms)

    const newSelectedTermLines = [...selectedTermLines]
    newSelectedTermLines[stepIndex] = screenPosition
    setSelectedTermLines(newSelectedTermLines)
  }

  const handleGuessPath = () => {
    console.log('Handling guess path')
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

  console.log(stepsToRender, selectedTermLines)

  const finalTermPosition = selectedTermLines[selectedTermLines.length - 1]

  const LINE_COLOR = props.isShowingResult ? getResultColor(props.isShowingResult, isDark) : isDark ? sunbeam : shadow

  return (
    <View style={styles.container}>
      <View style={styles.effectsContainer}>
        <Svg>
          {selectedTermLines.map((thisPos, index) => {
            const prevPos = index === 0 ? firstTermPosition.current : selectedTermLines[index - 1]
            return (
              <Line key={index} x1={prevPos.x} y1={prevPos.y} x2={thisPos.x} y2={thisPos.y} stroke={LINE_COLOR} strokeWidth={LINE_WIDTH} />
            )
          })}
          {props.isShowingResult && props.isResultCorrect && (
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
      <View style={styles.firstTermContainer}>
        <UIText onLayout={(e) => getScreenPositionFromLayoutEvent(e).then((pos) => (firstTermPosition.current = pos))}>{firstTerm}</UIText>
      </View>
      <View style={styles.pathsContainer}>
        {stepsToRender.map((termsArr, stepIndex) => (
          <View
            style={[styles.termsRow, stepIndex > 0 && stepsToRender.length > 0 && {borderTopWidth: 0}]}
            key={`terms-row-${stepIndex}-${termsArr.join()}`}
          >
            {termsArr.map((t, termIndex) => {
              const shouldFlash = props.isShowingResult && props.resultAnimation && correctTerms.includes(t)
              return (
                <Term
                  termStr={t}
                  key={`${stepIndex}-${termIndex}-${t}`}
                  isSelected={selectedTerms[stepIndex] === t}
                  onPress={(screenPosition) => handleClickTerm(stepIndex, t, screenPosition)}
                >
                  {shouldFlash && (
                    <Animated.View
                      style={[
                        styles.resultFlashOverlay,
                        {
                          backgroundColor: LINE_COLOR,
                          ...getFlashStylesForAnimation(props.resultAnimation),
                        },
                      ]}
                    />
                  )}
                </Term>
              )
            })}
          </View>
        ))}
      </View>
      <View style={styles.answerContainer}>
        <Pressable onPress={handleGuessPath}>
          <UIText onLayout={(e) => getScreenPositionFromLayoutEvent(e).then((pos) => (answerPosition.current = pos))}>{answer}</UIText>
        </Pressable>
      </View>
    </View>
  )
}

const boxStyle = {
  ...RoundBox,
  padding: spaceSmall,
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

  termsRow: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    paddingVertical: spaceSmall,
  },

  singleTermContainer: {
    ...boxStyle,
    borderWidth: 1,
  },

  answerContainer: {
    ...centerFlex,
    flex: 0,
    marginVertical: spaceExtraLarge,
  },

  pathsContainer: {
    ...centerFlex,
  },

  firstTermContainer: {
    ...centerFlex,
    flex: 0,
    marginVertical: spaceExtraLarge,
  },

  resultFlashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: spaceSmall,
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
