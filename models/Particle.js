import {white} from '../styles/colors'

export const SIZE_SMALL = 6
export const SIZE_MEDIUM = 14
export const SIZE_LARGE = 24

export const SPEED_SLOW = 1
export const SPEED_MEDIUM = 2
export const SPEED_FAST = 4

let ID_Counter = 0

class Particle {
  constructor(color, size, speed, duration) {
    this.id = ++ID_Counter
    this.color = color
    this.size = size
    this.speed = speed
    this.duration = duration
  }

  // TODO: How to pass generation rules with gradients and randomization (color, size, etc)
  static generateRandom(duration) {
    return new Particle(white, SIZE_SMALL, SPEED_SLOW, duration)
  }
}

export default Particle