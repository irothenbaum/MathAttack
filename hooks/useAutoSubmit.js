import {useEffect} from 'react'
import QuestionResult from '../models/QuestionResult'
import {useSelector} from 'react-redux'
import {selectCurrentQuestion, selectGameSettings, selectUserAnswer} from '../redux/selectors'

function useAutoSubmit(onCorrect) {
  const userAnswer = useSelector(selectUserAnswer)
  const currentQuestion = useSelector(selectCurrentQuestion)
  const gameSettings = useSelector(selectGameSettings)

  // Auto submit answer
  useEffect(() => {
    if (!gameSettings.autoSubmitCorrect || !currentQuestion || !userAnswer) {
      return
    }

    const result = new QuestionResult(currentQuestion, userAnswer)
    if (QuestionResult.isCorrect(result)) {
      onCorrect(currentQuestion, userAnswer, gameSettings)
    }
  }, [userAnswer])
}

export default useAutoSubmit
