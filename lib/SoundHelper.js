const Sound = require('react-native-sound')

export const SOUND_SLAM = 'slam.mp3'
export const SOUND_INTRO = 'intro.mp3'
export const SOUND_TYPING = 'typing.mp3'
export const SOUND_TAP = 'tap.mp3'
export const SOUND_BEEP = 'beep.mp3'
export const SOUND_START = 'start.mp3'

class SoundHelper {
  constructor() {
    Sound.setCategory('Playback')

    this.isMuted = false
    this._soundCache = {}
  }

  /**
   * @param {string} soundName
   * @param {number?} volume
   * @returns {Promise<Sound>}
   */
  async playSound(soundName, volume = 1) {
    if (this.isMuted) {
      return
    }

    let s = await this._ensureSound(soundName)
    s.setCurrentTime(0)
    s.setVolume(volume)

    return new Promise((resolve, reject) => {
      s.play((success) => {
        // s.release()
        return success ? resolve(s) : reject(new Error('Error playing sound ' + soundName))
      })
    })
  }

  /**
   * @param {string} soundName
   * @return {Promise<Sound>}
   * @private
   */
  async _ensureSound(soundName) {
    // TODO: if we want the same sound to be able to play over itself, we shouldn't have a sound cache
    if (!this._soundCache[soundName]) {
      return await new Promise((resolve, reject) => {
        const retVal = new Sound(soundName, Sound.MAIN_BUNDLE, (err) => {
          if (err) {
            return reject(err)
          }
          resolve(retVal)
        })
      })
    }
    return this._soundCache[soundName]
  }
}

export default new SoundHelper()
