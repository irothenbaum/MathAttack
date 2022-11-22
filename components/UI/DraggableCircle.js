import React from 'react'
import {StyleSheet, PanResponder, View} from 'react-native'
import Icon, {ArrowLeft, ArrowUp} from '../Icon'
import UIText from '../UIText'
import {font1, font3} from '../../styles/typography'
import PropTypes from 'prop-types'

/**
 * @see https://necolas.github.io/react-native-web/docs/pan-responder/
 */
class DraggableCircle extends React.Component {
  constructor(props) {
    super(props)
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: this._handlePanResponderGrant.bind(this),
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    })
    this._isPressed = false
    this._previousVal = 0
    this._circleValStyle = this._previousVal

    // TODO: should be overridden
    this._stylePropName = undefined
    this._gestureEventProp = undefined
  }

  _normalizeValue(v) {
    return Math.min(Math.max(this._previousVal + v, this.props.minVal), this.props.maxVal)
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (typeof nextProps.startingPosition === 'number' && nextProps.startingPosition !== this._startingVal && !this._isPressed) {
      this._startingVal = nextProps.startingPosition
      this._previousVal = this._circleValStyle = this._normalizeValue(nextProps.startingPosition)
      this._updateNativeStyles()
    }
    return nextProps.value !== this.props.value
  }

  componentDidMount() {
    this._updateNativeStyles()
  }

  render() {
    const mainValue = this.props.showDecimals ? parseInt(this.props.value) : Math.round(this.props.value)
    const decimal = (this.props.value - mainValue).toFixed(3).substr(1)

    return (
      <View ref={(c) => (this.circle = c)} style={[styles.slider, this.props.style]} {...this._panResponder.panHandlers}>
        {this._getMarkerTail()}
        <UIText style={{alignSelf: 'center', lineHeight: font3}}>
          {this.props.suffix || ''}
          {mainValue}
        </UIText>
        {this.props.showDecimals && <UIText style={{alignSelf: 'center', fontSize: font1, lineHeight: font1}}>{decimal}</UIText>}
      </View>
    )
  }

  _updateNativeStyles() {
    this.circle &&
      this.circle.setNativeProps({
        style: {
          opacity: typeof this._startingVal === 'number' ? 1 : 0,
          [this._stylePropName]: this._circleValStyle,
          ...(this._isPressed ? styles.sliderActive : styles.sliderInActive),
        },
      })
  }

  _handlePanResponderGrant() {
    this._isPressed = true
    this._updateNativeStyles()
  }

  _handlePanResponderMove = (e: Object, gestureState: Object) => {
    this._circleValStyle = this._normalizeValue(gestureState[this._gestureEventProp])
    this.props.onDrag(this._circleValStyle)
    this._updateNativeStyles()
  }

  _handlePanResponderEnd = (e: Object, gestureState: Object) => {
    this._previousVal = this._circleValStyle
    this.props.onDragComplete(this._previousVal)
    this._isPressed = false
    this._updateNativeStyles()
  }

  _getMarkerTail() {
    throw new Error('Must be overridden')
  }
}

export const SLIDER_SIZE = 70
export const TAIL_SIZE = 10
const halfSlider = SLIDER_SIZE / 2

const styles = StyleSheet.create({
  slider: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.5)',
    bottom: 0,
    right: 0,
    zIndex: 10,
    opacity: 0, // we're using this to hide the slider until startingPosition is established
    borderWidth: 4,
    borderRadius: halfSlider,
    height: SLIDER_SIZE,
    width: SLIDER_SIZE,
  },

  sliderActive: {
    backgroundColor: 'rgba(255,255,255, 0.3)',
  },

  sliderInActive: {
    backgroundColor: 'rgba(255,255,255, 1)',
  },
})

DraggableCircle.propTypes = {
  showDecimals: PropTypes.bool,
  suffix: PropTypes.string, // this is a little hacky so fractions looks ok :/
  value: PropTypes.number,
  startingPosition: PropTypes.number,
  minVal: PropTypes.number,
  maxVal: PropTypes.number,
  onDrag: PropTypes.func,
  onDragComplete: PropTypes.func,
  style: PropTypes.any,
}

export class VerticalDraggableCircle extends DraggableCircle {
  constructor(props) {
    super(props)
    this._stylePropName = 'top'
    this._gestureEventProp = 'dy'
  }

  _getMarkerTail() {
    return <Icon style={{position: 'absolute', left: -20}} icon={ArrowLeft} />
  }
}

VerticalDraggableCircle.propTypes = DraggableCircle.propTypes

export class HorizontalDraggableCircle extends DraggableCircle {
  constructor(props) {
    super(props)
    this._stylePropName = 'left'
    this._gestureEventProp = 'dx'
  }

  _getMarkerTail() {
    return <Icon style={{position: 'absolute', top: -20}} icon={ArrowUp} />
  }
}

HorizontalDraggableCircle.propTypes = DraggableCircle.propTypes
