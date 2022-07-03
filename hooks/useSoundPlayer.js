import React, {useEffect, useRef} from 'react'
import {useSelector} from 'react-redux'
import {selectGameSettings} from '../redux/selectors'
import SoundHelper from '../lib/SoundHelper'

function useSoundPlayer() {
  const areSoundsMuted = useSelector(selectGameSettings).muteSounds
  const playingSounds = useRef([])

  /**
   * @param {string} soundName
   * @param {number} volume
   * @return {Promise<number>}
   */
  const playSound = async (soundName, volume) => {
    if (areSoundsMuted) {
      return
    }
    const s = await SoundHelper.playSound(soundName, volume)
    playingSounds.current = [...playingSounds.current, s]
    return s.id
  }

  /**
   * @param {PlayableSound|number} s
   * @returns {Promise<boolean>}
   */
  const stopSound = async (s) => {
    if (!s) {
      return
    }

    const id = typeof s === 'number' ? s : s.id

    const sound = playingSounds.current.find((e) => e.id === id)

    if (!sound) {
      return
    }

    sound.stop()
    playingSounds.current = playingSounds.current.filter((e) => e.id !== id)
  }

  useEffect(() => {
    // when we unmount, we want to stop playing all sounds
    return () => {
      if (playingSounds.current.length > 0) {
        playingSounds.current.forEach((s) => s.stop())
      }
    }
  }, [])

  return {
    playSound,
    stopSound,
  }
}

export default useSoundPlayer
