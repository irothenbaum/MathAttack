import useAnimationStation from './useAnimationStation'
import {useState} from 'react'

const ANIMATION_DURATION = 1000

function useAnswerReactionResults() {
  const {animate, animation, isAnimating} = useAnimationStation()
  const [isAnimatingForCorrect, setIsAnimatingForCorrect] = useState(false)

  const animateCorrect = onComplete => {
    animate(ANIMATION_DURATION, onComplete)
    setIsAnimatingForCorrect(true)
  }

  const animateIncorrect = onComplete => {
    animate(ANIMATION_DURATION, onComplete)
    setIsAnimatingForCorrect(false)
  }

  return {
    isAnimatingForCorrect,
    animation: isAnimating ? animation : null,
    animateCorrect,
    animateIncorrect,
  }
}

export default useAnswerReactionResults
