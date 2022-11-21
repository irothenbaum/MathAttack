import React from 'react'
import VibrateHelper from '../lib/VibrateHelper'
import {useSelector} from 'react-redux'
import {selectGameSettings} from '../redux/selectors'

function useVibration() {
  const isVibrationDisabled = useSelector(selectGameSettings).disableVibration

  return {
    vibrateStart: (d) => (isVibrationDisabled ? null : VibrateHelper.Instance().vibrateStart(d)),
    vibrateOnce: (d) => (isVibrationDisabled ? null : VibrateHelper.Instance().vibrateOnce(d)),
    vibratePattern: (p) => (isVibrationDisabled ? null : VibrateHelper.Instance().vibratePattern(p)),
    stopVibrating: () => VibrateHelper.Instance().vibrateStop(),
  }
}

export default useVibration
