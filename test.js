import ParticleSprite from './components/FX/ParticleSprite'
import Particle from './models/Particle'
import {
  coordinatesToVector,
  MS_PER_FRAME,
  vectorToCoordinates,
} from './constants/engine'
import {DIRECTION_SOUTH} from './constants/engine'
import Vector from './models/Vector'
import Coordinates from './models/Coordinates'

let canvas
let lastStep = 0
let renderables = [...new Array(100)].map(
  () => new ParticleSprite(Particle.generateRandom(5000)),
)

function start() {
  if (!canvas) {
    return
  }

  let now = Date.now()
  if (lastStep === 0) {
    lastStep = now
  }

  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (renderables.length > 0) {
    renderables.forEach(p => {
      p.draw(ctx)
    })

    renderables.forEach(p => {
      p.step(now - lastStep)
    })
  }

  lastStep = now
}

$(document).ready(function () {
  canvas = $('#canvas')[0]
  canvas.width = $(window).width()
  canvas.height = $(window).height()
  setInterval(start, MS_PER_FRAME)
})
