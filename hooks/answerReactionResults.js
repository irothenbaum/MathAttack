import animationStation from './animationStation'
import {useState} from 'react'

const ANIMATION_DURATION = 1000

function answerReactionResults() {
  const {animate, animation, isAnimating, cancelAnimation} = animationStation()
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
    animation,
    animateCorrect,
    animateIncorrect,
  }
}

export default answerReactionResults
