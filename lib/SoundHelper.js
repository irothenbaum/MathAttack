const Sound = require('react-native-sound')

export const SOUND_SLAM = 'slam.mp3'
export const SOUND_INTRO = 'intro.mp3'
export const SOUND_TYPING = 'typing.mp3'
export const SOUND_TAP = 'tap.mp3'
export const SOUND_BEEP = 'beep.mp3'
export const SOUND_START = 'start.mp3'
export const SOUND_CLOSING_SWELL = 'closing_swell.mp3'

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
    return new Promise((resolve, reject) =>
      this.sound.stop(() => {
        console.log(`sound ${this.name} stopped`)
        this.sound.release()
        resolve(this)
      }),
    )
  }

  play() {
    this.sound.play()
  }
}

class SoundHelper {
  constructor() {
    Sound.setCategory('Playback')
  }

  /**
   * @param {string} soundName
   * @param {number?} volume
   * @returns {Promise<PlayableSound>}
   */
  async playSound(soundName, volume = 1) {
    let s = await this._constructSound(soundName)
    s.setCurrentTime(0)
    s.setVolume(volume)
    const retVal = new PlayableSound(soundName, s)
    retVal.play()
    return retVal
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
}

export default new SoundHelper()
