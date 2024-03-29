import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import PropTypes from 'prop-types'
import {font3} from '../styles/typography'
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight'
import {faChevronUp} from '@fortawesome/free-solid-svg-icons/faChevronUp'
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes'
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck'
import {faStar} from '@fortawesome/free-solid-svg-icons/faStar'
import {faHourglassHalf} from '@fortawesome/free-solid-svg-icons/faHourglassHalf'
import {faRunning} from '@fortawesome/free-solid-svg-icons/faRunning'
import {faBullseye} from '@fortawesome/free-solid-svg-icons/faBullseye'
import {faCog} from '@fortawesome/free-solid-svg-icons/faCog'
import {faChess} from '@fortawesome/free-solid-svg-icons/faChess'
import {faArrowUpRightDots} from '@fortawesome/free-solid-svg-icons/faArrowUpRightDots'
import {faSpinner} from '@fortawesome/free-solid-svg-icons/faSpinner'
import {faQuestion} from '@fortawesome/free-solid-svg-icons/faQuestion'
import {faCircle} from '@fortawesome/free-solid-svg-icons/faCircle'
import {faDotCircle} from '@fortawesome/free-solid-svg-icons/faDotCircle'
import {faVolumeHigh} from '@fortawesome/free-solid-svg-icons/faVolumeHigh'
import {faVolumeMute} from '@fortawesome/free-solid-svg-icons/faVolumeMute'
import {faPlus} from '@fortawesome/free-solid-svg-icons/faPlus'
import {faSubtract} from '@fortawesome/free-solid-svg-icons/faSubtract'
import {faDivide} from '@fortawesome/free-solid-svg-icons/faDivide'
import {faMedal} from '@fortawesome/free-solid-svg-icons/faMedal'
import {faUpRightAndDownLeftFromCenter} from '@fortawesome/free-solid-svg-icons/faUpRightAndDownLeftFromCenter'
import {faFire} from '@fortawesome/free-solid-svg-icons/faFire'
import {faCalendarCheck} from '@fortawesome/free-solid-svg-icons/faCalendarCheck'
import {faWaveSquare} from '@fortawesome/free-solid-svg-icons/faWaveSquare'
import {faPercent} from '@fortawesome/free-solid-svg-icons/faPercent'
import useColorsControl from '../hooks/useColorsControl'

function Icon(props) {
  const {foreground} = useColorsControl()
  return (
    <FontAwesomeIcon
      transform={props.transform}
      style={props.style}
      size={props.size || font3}
      icon={props.icon}
      color={props.color || foreground}
    />
  )
}

export const ArrowLeft = faChevronLeft
export const ArrowRight = faChevronRight
export const ArrowUp = faChevronUp
export const Check = faCheck
export const CircleActive = faCircle
export const CircleInactive = faDotCircle
export const Classic = faHourglassHalf
export const Crescendo = faArrowUpRightDots
export const DailyChallenge = faCalendarCheck
export const Estimate = faBullseye
export const Expand = faUpRightAndDownLeftFromCenter
export const Fire = faFire
export const Fractions = faPercent
export const HighScores = faMedal
export const Loading = faSpinner
export const Marathon = faRunning
export const OperationMultiply = faTimes
export const OperationAdd = faPlus
export const OperationSubtract = faSubtract
export const OperationDivide = faDivide
export const Question = faQuestion
export const Star = faStar
export const Settings = faCog
export const Versus = faChess
export const VolumeOn = faVolumeHigh
export const VolumeOff = faVolumeMute
export const VibrateOn = faWaveSquare
export const VibrateOff = faSubtract
export const X = faTimes

Icon.propTypes = {
  icon: PropTypes.any.isRequired,
  color: PropTypes.string,
  style: PropTypes.any,
  size: PropTypes.number,
  transform: PropTypes.any,
}

export default Icon
