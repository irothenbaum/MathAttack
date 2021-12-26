import Vector from '../models/Vector'
import Coordinates from '../models/Coordinates'
// import {Dimensions} from 'react-native'
import Acceleration from '../models/Acceleration'

export const GRAVITY_PIXELS_PER_SECOND = 20
export const GRAVITY_PIXELS_PER_MS = GRAVITY_PIXELS_PER_SECOND / 1000
export const FRAMES_PER_SECOND = 30
export const FRAMES_PER_MS = FRAMES_PER_SECOND / 1000
export const MS_PER_FRAME = 1 / FRAMES_PER_MS
export const PIXELS_PER_SECOND = 500 // Dimensions.get('window').width -- the standard unit of speed is the screen width in 1 second
export const PIXELS_PER_MS = PIXELS_PER_SECOND / 1000
export const TAU = Math.PI * 2

export const DIRECTION_EAST = 0
export const DIRECTION_NORTH = Math.PI * 1.5
export const DIRECTION_WEST = Math.PI
export const DIRECTION_SOUTH = Math.PI * 0.5

export function getForceOfGravity() {
  return new Acceleration(GRAVITY_PIXELS_PER_MS, new Vector(0, DIRECTION_SOUTH))
}

/**
 * @param {Coordinates} coordinates
 * @param {Vector} v2
 * @returns {Coordinates}
 */
export function applyVectorToCoordinates(coordinates, v2) {
  let pos2 = vectorToCoordinates(v2)

  let newX = coordinates.x + pos2.x
  let newY = coordinates.y + pos2.y

  let retVal = new Coordinates(newX, newY)
  return retVal
}

/**
 * @param {Array<Vector>} vectors
 * @returns {*}
 */
export function addManyVectors(vectors) {
  let retVal = vectors[0]

  for (let i = 1; i < vectors.length; i++) {
    retVal = addVectors(retVal, vectors[i])
  }

  return retVal
}

/**
 * @param {Vector} v1
 * @param {Vector} v2
 * @returns {Vector}
 */
export function addVectors(v1, v2) {
  let pos1 = vectorToCoordinates(v1)
  let newCoordinates = applyVectorToCoordinates(pos1, v2)
  return coordinatesToVector(newCoordinates)
}

/**
 * @param {Coordinates} coords
 * @returns {Vector}
 */
export function coordinatesToVector(coords) {
  // we need to negate Y so that our grid coordinates match the graph coordinates
  /*
           (-)
            ^
            |
            |
  (-)<------|------>(+)
            |
            |
            V
           (+)
   */
  let rawRotation = round(Math.atan(coords.y / coords.x))
  if (coords.x < 0) {
    rawRotation += Math.PI
  }
  let newRotation = (TAU + rawRotation) % TAU
  let newSpeed = Math.sqrt(Math.pow(coords.x, 2) + Math.pow(coords.y, 2))
  let retVal = new Vector(newSpeed, newRotation)
  return retVal
}

/**
 * @param {Vector} vector
 * @returns {Coordinates}
 */
export function vectorToCoordinates(vector) {
  return new Coordinates(
    round(Math.cos(vector.direction)) * vector.speed,
    round(Math.sin(vector.direction)) * vector.speed,
  )
}

export function round(v) {
  return Math.round(v * 10000) / 10000
}
