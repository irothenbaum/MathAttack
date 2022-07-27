import React, {useEffect, useState} from 'react'
import {Animated, View, StyleSheet, Pressable} from 'react-native'
import Equation from '../models/Equation'
import UIText from './UIText'
import {spaceSmall} from '../styles/layout'
import useDarkMode from '../hooks/useDarkMode'
import PhraseBuffer from '../models/PhraseBuffer'
import Phrase from '../models/Phrase'
import PropTypes from 'prop-types'
import {selectGameSettings} from '../redux/selectors'
import {useSelector} from 'react-redux'
import {ANSWER_TIMEOUT} from '../constants/game'
import {RoundBox} from '../styles/elements'
import {getFlashStylesForAnimation, getResultColor, getUIColor} from '../lib/utilities'

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
  const isDark = useDarkMode()

  return (
    <Pressable onPress={props.onPress}>
      <View
        style={[
          styles.singleTermContainer,
          {borderColor: getUIColor(isDark), backgroundColor: props.isSelected ? getResultColor(true, isDark) : undefined},
        ]}
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

function CrescendoInterface(props) {
  const [selectedTerms, setSelectedTerms] = useState([])
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
    console.log(`Making ${fakesToMake} fakes`)

    const s = correctPath.map((t, i) => {
      const fakesOnThisRow = Math.min(fakesToMake, MAX_FAKES_PER_ROW)
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

    setCorrectTerms(correctPath)
    setStepsToRender(s)
  }, [props.equation])

  useEffect(() => {
    if (selectedTerms.length > 0 && selectedTerms.length === stepsToRender.length && gameSettings.autoSubmit) {
      console.log('AUTO SUBMITTING')
      handleGuessPath()
    }
  }, [selectedTerms])

  const handleClickTerm = (stepIndex, termStr) => {
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
    // reset selections
    setSelectedTerms([])
    try {
      const phrase = phraseBuffer.toPhrase()
      const a = Phrase.getSolution(phrase)
      props.onSubmitAnswer(a)
    } catch (err) {
      props.onSubmitAnswer(ANSWER_TIMEOUT)
    }
  }

  console.log(stepsToRender)

  return (
    <View style={styles.container}>
      <View style={styles.firstTermContainer}>
        <UIText>{firstTerm}</UIText>
      </View>
      <View style={[styles.pathsContainer, {flex: stepsToRender.length + 1}]}>
        <View style={styles.startArrowContainer} />
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
                  onPress={() => handleClickTerm(stepIndex, t)}
                >
                  {shouldFlash && (
                    <Animated.View
                      style={[
                        styles.resultFlashOverlay,
                        {
                          backgroundColor: getResultColor(props.isResultCorrect, isDark),
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
        <View style={styles.equalsContainer} />
      </View>
      <View style={styles.answerContainer}>
        <Pressable onPress={handleGuessPath} style={styles.answerPressable}>
          <UIText>{answer}</UIText>
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

  termsRow: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    paddingVertical: spaceSmall,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },

  singleTermContainer: {
    ...boxStyle,
    borderWidth: 1,
  },

  answerContainer: {
    ...centerFlex,
    justifyContent: 'flex-end',
  },

  pathsContainer: {
    ...centerFlex,
  },

  firstTermContainer: {
    ...centerFlex,
    justifyContent: 'flex-start',
  },

  startArrowContainer: {},

  equalsContainer: {},

  answerPressable: {
    ...boxStyle,
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

export const MAX_FAKES_PER_ROW = 3
