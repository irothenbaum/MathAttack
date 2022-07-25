import React, {useEffect, useState} from 'react'
import {Animated, View, StyleSheet, Pressable} from 'react-native'
import Equation from '../models/Equation'
import UIText from './UIText'
import {spaceSmall} from '../styles/layout'
import {font4} from '../styles/typography'
import {dimmedRed, neonRed} from '../styles/colors'
import useDarkMode from '../hooks/useDarkMode'
import PhraseBuffer from '../models/PhraseBuffer'
import Phrase from '../models/Phrase'
import PropTypes from 'prop-types'
import {selectGameSettings} from '../redux/selectors'

/**
 * @param {term: number, operation: string} t
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

  return (
    <Pressable onPress={props.onPress}>
      <View style={[styles.singleTermContainer]}>
        <UIText>
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
  const gameSettings = selectGameSettings()

  const numbersAndOperators = Equation.getLeftSideInfixNotation(props.equation)
  const answer = Equation.getSolution(props.equation)
  const [stepsToRender, setStepsToRender] = useState([])

  // we shift off the first term, and then the rest are the paths in groups of 2
  const firstTerm = numbersAndOperators.shift()

  useEffect(() => {
    const correctPath = []
    for (let i = 0; i < numbersAndOperators.length; i += 2) {
      correctPath.push(termToStr({operation: numbersAndOperators[i], term: numbersAndOperators[i + 1]}))
    }

    let fakesToMake = Math.max(0, props.difficulty - correctPath.length)

    setStepsToRender(
      correctPath.map((t, i) => {
        const fakesOnThisRow = Math.min(fakesToMake, MAX_FAKES_PER_ROW)
        const termsToRender = [
          t,
          [...new Array(fakesOnThisRow)].map(() => {
            let termStr
            do {
              const eq = Equation.getRandomFromSettings(gameSettings)
              termStr = termToStr({term: eq.phrase.term2, operation: eq.phrase.operation})
            } while (termStr === t)
            return termStr
          }),
        ]

        fakesToMake -= fakesOnThisRow

        return shuffleArray(termsToRender)
      }),
    )
  }, [props.equation, numbersAndOperators])

  const handleClickTerm = (stepIndex, termStr) => {
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
    const phrase = phraseBuffer.toPhrase()
    const a = Phrase.getSolution(phrase)
    props.onSubmitAnswer(a)
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={handleGuessPath}>
        <View style={styles.answerContainer}>
          <UIText>{answer}</UIText>
        </View>
      </Pressable>
      <View style={[styles.pathsContainer, {flex: stepsToRender.length}]}>
        <View style={styles.equalsContainer} />
        {stepsToRender.map((termsArr, stepIndex) => (
          <View style={styles.termsRow} key={termsArr.join()}>
            {termsArr.map((t, termIndex) => (
              <Term
                termStr={t}
                key={`${stepIndex}-${termIndex}-${t}`}
                isSelected={selectedTerms[stepIndex] === t}
                onPress={() => handleClickTerm(stepIndex, t)}
              />
            ))}
          </View>
        ))}
        <View style={styles.startArrowContainer} />
      </View>
      <View style={styles.firstTermContainer}>
        <UIText>{firstTerm}</UIText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  pathsContainer: {
    flex: 1,
  },

  termsRow: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  singleTermContainer: {},

  answerContainer: {
    flex: 1,
  },

  firstTermContainer: {
    flex: 1,
  },

  startArrowContainer: {},

  equalsContainer: {},
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
