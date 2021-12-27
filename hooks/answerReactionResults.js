import animationStation from './animationStation'

function answerReactionResults() {
  const {
    animate: animateCelebrate,
    animation: celebrateAnim,
    isAnimating: isCelebrating,
    cancelAnimation: cancelCelebrate,
  } = animationStation()
  const {
    animate: animateMourn,
    animation: mournAnim,
    isAnimating: isMourning,
    cancel: cancelMourn,
  } = animationStation()

  const celebrate = (duration, onComplete) => {
    if (isMourning) {
      cancelMourn()
    }
    return animateCelebrate(duration, onComplete)
  }

  const mourn = (duration, onComplete) => {
    if (isCelebrating) {
      cancelCelebrate()
    }
    return animateMourn(duration, onComplete)
  }

  return {
    celebrate,
    mourn,
    isCelebrating,
    isMourning,
    celebrateAnim,
    mournAnim,
  }
}

export default answerReactionResults
