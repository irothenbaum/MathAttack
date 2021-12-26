import {white} from '../styles/colors'
import Vector from './Vector'
import Coordinates from './Coordinates'
import Acceleration from './Acceleration'
import {
  addManyVectors,
  applyVectorToCoordinates,
  getForceOfGravity,
  TAU,
} from '../constants/engine'

export const SIZE_SMALL = 6
export const SIZE_MEDIUM = 14
export const SIZE_LARGE = 24

export const SPEED_SLOW = 1
export const SPEED_MEDIUM = 2
export const SPEED_FAST = 4

let ID_Counter = 0

class Particle {
  /**
   * @param {string} color
   * @param {number} size
   * @param {Coordinates} position
   * @param {Vector} initialVelocity
   * @param {number} duration
   */
  constructor(color, size, position, initialVelocity, duration) {
    this.id = ++ID_Counter
    this.color = color
    this.size = size
    this.position = position
    this.duration = duration

    // the 2 forces that act on a particle are its constant initial velocity and gravity
    this.forces = [new Acceleration(0, initialVelocity), getForceOfGravity()]
  }

  /**
   * @param {number} timeDelta
   */
  stepFrame(timeDelta) {
    this.duration -= timeDelta

    if (this.duration < 0) {
      // TODO: destroy
      return
    }

    // new force vectors
    let velocities = this.forces.map(a => a.stepFrame(timeDelta))
    let consolidatedVector = addManyVectors(velocities)
    this.position = applyVectorToCoordinates(this.position, consolidatedVector)
  }

  // TODO: How to pass generation rules with gradients and randomization (color, size, etc)
  static generateRandom(duration) {
    let dir = Math.random() * TAU
    return new Particle(
      white,
      SIZE_SMALL,
      new Coordinates(200, 200),
      new Vector(4, dir),
      duration,
    )
  }
}

export default Particle
