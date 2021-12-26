import React, {useState, useEffect, useRef, useCallback} from 'react'
import {Dimensions, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import Canvas from 'react-native-canvas'
import Renderable from '../../models/Renderable'
import {MS_PER_FRAME} from '../../constants/engine'

function RenderFX(props) {
  const canvas = useRef()
  const lastStep = useRef(0)

  const step = useCallback(() => {
    if (!canvas.current) {
      return
    }

    let now = Date.now()
    if (lastStep.current === 0) {
      lastStep.current = now
    }

    const ctx = canvas.current.getContext('2d')

    // clear canvas
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height)

    if (props.renderables.length > 0) {
      props.renderables.forEach(p => {
        p.draw(ctx)
      })

      props.renderables.forEach(p => {
        p.step(now - lastStep.current)
      })
    }

    lastStep.current = now
  }, [canvas, props.renderables])

  useEffect(() => {
    let interval = setInterval(step, MS_PER_FRAME)
    return () => {
      clearInterval(interval)
    }
  }, [step])

  const handleCanvasRef = c => {
    if (!c) {
      return
    }

    let dim = Dimensions.get('window')
    c.width = dim.width
    c.height = dim.height
    canvas.current = c
  }

  return <Canvas style={styles.root} ref={handleCanvasRef} />
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'rgba(0, 0, 255, 1)', // for testing purposes
    width: '100%',
    height: '100%',
  },
})

RenderFX.propTypes = {
  renderables: PropTypes.arrayOf(PropTypes.instanceOf(Renderable)),
}

export default RenderFX
