const Sound = require('react-native-sound')

export const SOUND_SLAM = 'slam.mp3'
export const SOUND_TYPING = 'typing.mp3'
export const SOUND_TAP = 'tap.mp3'
export const SOUND_BEEP = 'beep.mp3'
export const SOUND_START = 'start.mp3'
export const SOUND_WRONG = 'wrong_buzz.mp3'
export const SOUND_CORRECT_DING = 'correct_ding.mp3'
export const SOUND_CORRECT_CHIME = 'correct_chime.mp3'
export const SOUND_BUTTON_BEEP = 'button_beep.mp3'
export const SOUND_BUTTON_CHIME = 'button_chime.mp3'

let ID_COUNTER = 0

export class PlayableSound {
  /**
   * @param {string} soundName
   * @param {Sound} rnSound
   */
  constructor(soundName, rnSound) {
    this.name = soundName
    this.sound = rnSound
    this.id = ++ID_COUNTER
  }

  stop() {
    this.isPlaying = false
    this.sound.stop()
  }

  play(volume) {
    this.sound.setCurrentTime(0)
    this.sound.setVolume(volume)
    this.isPlaying = true
    this.sound.play(() => (this.isPlaying = false))
  }
}

class SoundHelper {
  constructor() {
    if (SoundHelper._INSTANCE) {
      throw new Error('Sound Helper is a Singleton')
    }

    Sound.setCategory('Playback')
    this.soundsCache = {}
  }

  /**
   * @param {string} soundName
   * @param {number?} volume
   * @returns {Promise<PlayableSound>}
   */
  async playSound(soundName, volume = 1) {
    let playableSound
    if (this.soundsCache[soundName]) {
      playableSound = this.soundsCache[soundName].find((p) => !p.isPlaying)
    }

    if (!playableSound) {
      let s = await this._constructSound(soundName)
      playableSound = new PlayableSound(soundName, s)
      this.soundsCache[soundName] = this.soundsCache[soundName] || []
      this.soundsCache[soundName].push(playableSound)
    }

    playableSound.play(volume)
    return playableSound
  }

  /**
   * @param {string} soundName
   * @return {Promise<Sound>}
   * @private
   */
  async _constructSound(soundName) {
    return await new Promise((resolve, reject) => {
      const retVal = new Sound(soundName, Sound.MAIN_BUNDLE, (err) => {
        if (err) {
          return reject(err)
        }
        resolve(retVal)
      })
    })
  }

  /**
   * @returns {SoundHelper}
   * @constructor
   */
  static Instance() {
    if (!SoundHelper._INSTANCE) {
      SoundHelper._INSTANCE = new SoundHelper()
    }

    return SoundHelper._INSTANCE
  }
}

export default SoundHelper
