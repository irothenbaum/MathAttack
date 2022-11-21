import {useEffect, useRef, useState} from 'react'
import GameQuestion from '../models/GameQuestion'
import {Easing} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {selectCurrentQuestion} from '../redux/selectors'
import {recordAnswer} from '../redux/GameSlice'
import {ANSWER_TIMEOUT} from '../constants/game'
import useAnimationStation from './useAnimationStation'
import useAnswerReactionResults from './useAnswerReactionResults'
import {goToScene} from '../redux/NavigationSlice'
import {Scene_GameResults} from '../constants/scenes'
import useDoOnceTimer from './useDoOnceTimer'
import {setAnswer} from '../redux/UISlice'
import {SOUND_WRONG} from '../lib/SoundHelper'
import useSoundPlayer from './useSoundPlayer'
import useVibration from './useVibration'
import {VIBRATE_ONCE_WRONG} from '../lib/VibrateHelper'

export const NEXT_QUESTION_TIMEOUT = 2000
const NEXT_QUESTION_TIMER = 'next-question-timer'

/**
 * @param {number} questionDurationMS
 * @param {number} numberOfQuestions
 * @param {function} questionGeneratorFunction
 * @param {boolean?} suddenDeath
 */
function useClassicAnswerSystem(questionDurationMS, numberOfQuestions, questionGeneratorFunction, suddenDeath) {
  const currentQuestion = useSelector(selectCurrentQuestion)
  const lastGuess = useRef(null)
  const [questionsRemaining, setQuestionsRemaining] = useState(numberOfQuestions)
  const {animation: equationTimer, animate: startEquationTimer, cancel: cancelEquationTimer} = useAnimationStation()
  const {isAnimatingForCorrect, animation, animateCorrect, animateIncorrect} = useAnswerReactionResults()
  const {setTimer, isTimerSet} = useDoOnceTimer()
  const {playSound} = useSoundPlayer()
  const {vibrateOnce} = useVibration()

  const dispatch = useDispatch()

  useEffect(() => {
    if (currentQuestion) {
      let msRemaining = GameQuestion.getMSRemaining(currentQuestion)
      let amountRemaining = 1 - msRemaining / questionDurationMS
      startEquationTimer(msRemaining, () => handleTimeout(), Easing.linear, amountRemaining)
    } else {
      cancelEquationTimer()
    }
  }, [currentQuestion])

  /**
   * @param {boolean?} forceGameOver
   */
  const handleNextQuestion = (forceGameOver) => {
    dispatch(setAnswer(''))
    cancelEquationTimer()
    // always reset the input
    lastGuess.current = null
    let nextQuestionsRemaining = questionsRemaining - 1
    if (nextQuestionsRemaining > 0 && !forceGameOver) {
      setTimer(
        NEXT_QUESTION_TIMER,
        () => {
          setQuestionsRemaining(nextQuestionsRemaining)
          dispatch(questionGeneratorFunction())
        },
        NEXT_QUESTION_TIMEOUT,
      )
    } else {
      setTimer(NEXT_QUESTION_TIMER, () => dispatch(goToScene(Scene_GameResults)), NEXT_QUESTION_TIMEOUT)
    }
  }

  const handleTimeout = () => {
    dispatch(recordAnswer(typeof lastGuess.current === 'number' ? lastGuess.current : ANSWER_TIMEOUT))
    animateIncorrect()
    playSound(SOUND_WRONG).then()
    vibrateOnce(VIBRATE_ONCE_WRONG)
    handleNextQuestion(suddenDeath)
  }

  const markLastGuess = (a) => {
    lastGuess.current = a
  }

  const isShowingAnswer = !!currentQuestion && isTimerSet(NEXT_QUESTION_TIMER)

  return {
    animateIncorrect,
    animateCorrect,
    handleNextQuestion,
    markLastGuess,
    equationTimer,
    isAnimatingForCorrect,
    animation,
    isShowingAnswer,
    questionsRemaining,
  }
}

export default useClassicAnswerSystem
