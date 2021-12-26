class Vector {
  /**
   * @param {number} speed
   * @param {number} direction -- rotation in radians, 0 === East
   */
  constructor(speed, direction) {
    this.speed = speed
    this.direction = direction
  }
}

export default Vector
