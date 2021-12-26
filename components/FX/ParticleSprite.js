import Particle from '../../models/Particle'
import Renderable from '../../models/Renderable'
import {TAU} from '../../constants/engine'

class ParticleSprite extends Renderable {
  /**
   * @param {Particle} particle
   */
  constructor(particle) {
    super()
    this.particle = particle
  }

  step(timeDelta) {
    this.particle.stepFrame(timeDelta)
  }

  draw(ctx) {
    const pos = this.particle.position
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, this.particle.size, 0, TAU, false)
    ctx.fillStyle = this.particle.color
    ctx.fill()
    ctx.lineWidth = 5
    ctx.strokeStyle = '#000033'
    ctx.stroke()
  }
}

export default ParticleSprite
