const Sound = require('react-native-sound')

export const SOUND_SLAM = 'slam.mp3'

class SoundHelper {
  constructor() {
    Sound.setCategory('Playback')

    this._soundCache = {}
  }

  /**
   * @param {string} soundName
   * @param {number?} volume
   * @returns {Promise<Sound>}
   */
  async playSound(soundName, volume = 1) {
    let s = await this._ensureSound(soundName)
    s.setCurrentTime(0)
    s.setVolume(volume)

    return new Promise((resolve, reject) => {
      s.play((success) => (success ? resolve(s) : reject(new Error('Error playing sound ' + soundName))))
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
      this._soundCache[soundName] = await new Promise((resolve, reject) => {
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
