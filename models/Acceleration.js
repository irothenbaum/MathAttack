import Vector from './Vector'
import {PIXELS_PER_MS} from '../constants/engine'

class Acceleration {
  /**
   * @param {number} velocityDelta
   * @param {Vector} startingVelocity
   */
  constructor(velocityDelta, startingVelocity) {
    this.velocityDelta = velocityDelta
    this.startingVelocity = startingVelocity
    this.currentVelocity = startingVelocity
  }

  /**
   * @param {number} timeMS
   * @returns {Vector}
   */
  getVelocityAtTime(timeMS) {
    return new Vector(
      this.startingVelocity + this.velocityDelta * timeMS * PIXELS_PER_MS,
      this.currentVelocity.direction,
    )
  }

  /**
   * @param {number} timeDelta
   * @returns {Vector}
   */
  stepFrame(timeDelta) {
    this.currentVelocity = new Vector(
      this.currentVelocity.speed +
        this.velocityDelta * timeDelta +
        PIXELS_PER_MS,
      this.currentVelocity.direction,
    )

    return this.currentVelocity
  }

  /**
   * @returns {Acceleration}
   */
  clone() {
    let retVal = new Acceleration(this.velocityDelta, this.currentVelocity)
    retVal.startingVelocity = this.startingVelocity

    return retVal
  }
}

export default Acceleration
