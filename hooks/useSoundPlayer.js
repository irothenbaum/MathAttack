import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {selectGameSettings} from '../redux/selectors'
import SoundHelper from '../lib/SoundHelper'

function useSoundPlayer() {
  const areSoundsMuted = useSelector(selectGameSettings).muteSounds
  const [playingSounds, setPlayingSounds] = useState([])

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
    setPlayingSounds([...playingSounds, s])
    return s.id
  }

  /**
   * @param {PlayableSound|number} s
   * @returns {Promise<boolean>}
   */
  const stopSound = async (s) => {
    console.log('STOPPING SOUND WITH ID ' + s)
    if (!s) {
      return
    }

    const id = typeof s === 'number' ? s : s.id

    const sound = playingSounds.find((e) => e.id === id)

    if (!sound) {
      console.log('CANNOT FIND SOUND WITH ID ' + id)
      return
    }

    await sound.stop()
    console.log('SOUND STOPPED')
    setPlayingSounds(playingSounds.filter((e) => e.id !== id))
  }

  useEffect(() => {
    // when we unmount, we want to stop playing all sounds
    return () => {
      if (playingSounds.length > 0) {
        Promise.all(playingSounds.map()).then()
      }
    }
  }, [])

  return {
    playSound,
    stopSound,
  }
}

export default useSoundPlayer
