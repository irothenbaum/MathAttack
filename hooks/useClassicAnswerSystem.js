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
import {SOUND_CLOSING_SWELL} from '../lib/SoundHelper'
import useSoundPlayer from './useSoundPlayer'

export const NEXT_QUESTION_TIMEOUT = 2000
const NEXT_QUESTION_TIMER = 'next-question-timer'
const TIMER_ENDING_RUMBLE_TIMER = 'timer-ending-rumble'

/**
 * @param {number} questionDurationMS
 * @param {number} numberOfQuestions
 * @param {function} questionGeneratorFunction
 */
function useClassicAnswerSystem(questionDurationMS, numberOfQuestions, questionGeneratorFunction) {
  const currentQuestion = useSelector(selectCurrentQuestion)
  const lastGuess = useRef(null)
  const [questionsRemaining, setQuestionsRemaining] = useState(numberOfQuestions)
  const {animation: equationTimer, animate: startEquationTimer, cancel: cancelEquationTimer} = useAnimationStation()
  const {isAnimatingForCorrect, animation, animateCorrect, animateIncorrect} = useAnswerReactionResults()
  const {setTimer, isTimerSet, cancelTimer} = useDoOnceTimer()
  const {playSound, stopSound} = useSoundPlayer()
  const playingTrembleSound = useRef()

  const dispatch = useDispatch()

  useEffect(() => {
    if (currentQuestion) {
      let msRemaining = GameQuestion.getMSRemaining(currentQuestion)
      let amountRemaining = 1 - msRemaining / questionDurationMS
      startEquationTimer(msRemaining, handleTimeout, Easing.linear, amountRemaining)
      if (!isTimerSet(TIMER_ENDING_RUMBLE_TIMER)) {
        // We want the rumble to start 3 seconds before the end of the timer
        console.log('STARTING RUMBLE TIMER')
        setTimer(
          TIMER_ENDING_RUMBLE_TIMER,
          () => {
            console.log('STARTING RUMBLE')
            playSound(SOUND_CLOSING_SWELL).then((id) => {
              console.log('SAVING RUMBLE SONG ID ' + id)
              playingTrembleSound.current = id
            })
          },
          msRemaining - 3000,
        )
      }
    } else {
      cancelEquationTimer()
    }
  }, [currentQuestion])

  const handleNextQuestion = () => {
    dispatch(setAnswer(''))
    cancelTimer(TIMER_ENDING_RUMBLE_TIMER)
    if (playingTrembleSound.current) {
      playingTrembleSound.current
      stopSound(playingTrembleSound.current).then(() => {
        playingTrembleSound.current = undefined
        console.log('Unsetting rumble sound id')
      })
    } else {
      console.log('No rumble song id present')
    }
    cancelEquationTimer()
    // always reset the input
    lastGuess.current = null
    let nextQuestionsRemaining = questionsRemaining - 1
    if (nextQuestionsRemaining > 0) {
      setQuestionsRemaining(nextQuestionsRemaining)
      setTimer(NEXT_QUESTION_TIMER, () => dispatch(questionGeneratorFunction()), NEXT_QUESTION_TIMEOUT)
    } else {
      setTimer(NEXT_QUESTION_TIMER, () => dispatch(goToScene(Scene_GameResults)), NEXT_QUESTION_TIMEOUT)
    }
  }

  const handleTimeout = () => {
    dispatch(recordAnswer(typeof lastGuess.current === 'number' ? lastGuess.current : ANSWER_TIMEOUT))
    animateIncorrect()
    handleNextQuestion()
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
