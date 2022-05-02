import {useState} from 'react'
import isDarkMode from './isDarkMode'
import {getRandomTintColor} from '../lib/utilities'

function useRandomColor() {
  const isDark = isDarkMode()
  const [color, setColor] = useState(getRandomTintColor(isDark))

  const randomizeColor = () => {
    setColor(getRandomTintColor(isDark))
  }

  return {
    randomizeColor: randomizeColor,
    color: color,
  }
}

export default useRandomColor
