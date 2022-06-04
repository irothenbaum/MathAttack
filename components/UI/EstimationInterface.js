import React, {useCallback, useEffect, useState} from 'react'
import {PanResponder, Animated, View, StyleSheet, Slider as RNSlider} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {selectGameSettings, selectUserAnswer} from '../../redux/selectors'
import UIText from '../UIText'
import {font1, font2, font3} from '../../styles/typography'
import {spaceDefault, spaceSmall} from '../../styles/layout'
import isDarkMode from '../../hooks/isDarkMode'
import {getUIColor} from '../../lib/utilities'
import {useSharedValue, useAnimatedStyle, withSpring} from 'react-native-reanimated'
import {GestureDetector, Gesture} from 'react-native-gesture-handler'
import {setAnswer} from '../../redux/UISlice'

const numberOfSteps = 10

// ----------------------------------------------------------------------------------------

function RulerNotch(props) {
  const isDark = isDarkMode()
  const showMinorNotches = props.value !== 0
  const colorStyle = {backgroundColor: getUIColor(isDark)}
  const minorNotchColorStyle = {backgroundColor: showMinorNotches ? colorStyle.backgroundColor : 'transparent'}

  return (
    <View style={styles.notchContainer} onLayout={props.onLayout}>
      <View style={styles.notchMarksContainer}>
        <View style={[styles.rulerMarkPrimary, colorStyle]} />
        <View style={[styles.rulerMarkMinor, minorNotchColorStyle]} />
        <View style={[styles.rulerMarkMinor, minorNotchColorStyle]} />
      </View>
      <UIText style={styles.rulerText}>{props.value}</UIText>
    </View>
  )
}

// ----------------------------------------------------------------------------------------
/*
Slider not working, some crash bullshit using Draggable Circle for now
function Slider(props) {
  const isPressed = useSharedValue(false)
  const offset = useSharedValue({x: 0, y: 0})
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateX: offset.value.x}, {translateY: offset.value.y}, {scale: withSpring(isPressed.value ? 1.2 : 1)}],
      backgroundColor: isPressed.value ? 'yellow' : 'blue',
    }
  })

  const start = useSharedValue({x: 0, y: 0})
  const gesture = Gesture.Pan()
    .averageTouches(true)
    .onUpdate((e) => {
      console.log('UPDATE')
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      }
    })
    .onEnd(() => {
      console.log('END')
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      }
    })

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.slider, {borderColor: getUIColor(isDarkMode())}, animatedStyles, props.style]} />
    </GestureDetector>
  )
}*/

// ----------------------------------------------------------------------------------------

function EstimationInterface(props) {
  const [containerBottomPosition, setContainerBottomPosition] = useState(0)
  const [topNotchTopPosition, setTopNotchTopPosition] = useState(1)
  const [bottomNotchTopPosition, setBottomNotchTopPosition] = useState(1)
  const answer = useSelector(selectUserAnswer)
  const settings = useSelector(selectGameSettings)

  const fontSizeAdjust = rulerFontSize / 2
  const sliderStyles = {
    top: topNotchTopPosition + fontSizeAdjust,
    bottom: containerBottomPosition - fontSizeAdjust - bottomNotchTopPosition,
  }

  console.log('Interface Screen Bottom Position:', containerBottomPosition)
  console.log(sliderStyles)

  const range = settings.maxValue - settings.minValue
  const stepSize = range / numberOfSteps

  return (
    <View
      style={styles.container}
      onLayout={(ev) => {
        const {x, y, height, width} = ev.nativeEvent.layout
        setContainerBottomPosition(y + height)
      }}
    >
      <Slider style={sliderStyles} />
      <View style={styles.ruler}>
        {containerBottomPosition > 0 &&
          [...new Array(numberOfSteps + 1)].map((e, i) => {
            const value = parseInt(stepSize * (numberOfSteps - i))
            return (
              <RulerNotch
                key={value}
                value={value}
                onLayout={
                  i === 0 || i === numberOfSteps
                    ? (ev) => {
                        const {x, y, height, width} = ev.nativeEvent.layout
                        if (i === 0) {
                          console.log('top notch top Position: ', y)
                          setTopNotchTopPosition(y)
                        } else if (i === numberOfSteps) {
                          console.log('bottom notch top position: ', y)
                          setBottomNotchTopPosition(y)
                        }
                      }
                    : undefined
                }
              />
            )
          })}
      </View>
    </View>
  )
}

const sliderSize = 60
const rulerFontSize = font2

const styles = StyleSheet.create({
  container: {},

  ruler: {
    paddingVertical: spaceDefault,
    backgroundColor: 'red',
    height: '100%',
    width: 100,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  notchContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingRight: spaceDefault,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flex: 1,
    overflow: 'visible',
  },

  notchMarksContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '100%',
  },

  rulerMarkMinor: {
    width: 10,
    height: 2,
  },

  rulerMarkPrimary: {
    width: 18,
    height: 4,
  },
  rulerText: {
    flex: 1,
    textAlign: 'right',
    fontSize: rulerFontSize,
  },

  slider: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.5)',
    bottom: 0,
    right: 0,
    zIndex: 10,
    borderWidth: 4,
    borderRadius: sliderSize / 2,
    height: sliderSize,
    width: sliderSize,
  },

  sliderContainer: {
    position: 'absolute',
    top: sliderSize / 2,
    left: 0,
    bottom: sliderSize / 2,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0,255,0, 0.3)',
  },
})

export default EstimationInterface

function Slider(props) {
  const [containerHeight, setContainerHeight] = useState(1)
  const [tempValue, setTempValue] = useState(0)
  const settings = useSelector(selectGameSettings)
  const answer = useSelector(selectUserAnswer)

  const range = settings.maxValue - settings.minValue

  const dispatch = useDispatch()

  const getAnswerFromTopValue = useCallback(
    (topValue) => {
      return ((containerHeight - (topValue + sliderSize / 2)) / containerHeight) * range + settings.minValue
    },
    [containerHeight, range, settings],
  )

  const handleSlide = ({top}) => {
    setTempValue(getAnswerFromTopValue(top))
  }

  const handleSubmitAnswer = ({top}) => {
    dispatch(setAnswer(getAnswerFromTopValue(top)))
  }

  console.log('value: ', tempValue)

  return (
    <View
      style={[styles.sliderContainer, props.style]}
      onLayout={(ev) => {
        const {height} = ev.nativeEvent.layout
        setContainerHeight(height)
      }}
    >
      <DraggableCircle
        style={{
          bottom: `${parseFloat((100 * answer) / range).toFixed(2)}%`,
        }}
        onDrag={handleSlide}
        onDragComplete={handleSubmitAnswer}
      />
    </View>
  )
}

/**
 * @see https://necolas.github.io/react-native-web/docs/pan-responder/
 */
class DraggableCircle extends React.PureComponent {
  _panResponder = {}
  _previousLeft = 0
  _previousTop = 0
  circle = null

  constructor() {
    super()
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    })
    this._previousLeft = 0
    this._previousTop = 0
    this._circleStyles = {
      style: {
        left: this._previousLeft,
        top: this._previousTop,
      },
    }
  }

  componentDidMount() {
    this._updateNativeStyles()
  }

  render() {
    return <View ref={this._setCircleRef} style={styles.slider} {...this._panResponder.panHandlers} />
  }

  _setCircleRef = (circle) => {
    this.circle = circle
  }

  _highlight() {
    this._updateNativeStyles()
  }

  _unHighlight() {
    this._updateNativeStyles()
  }

  _updateNativeStyles() {
    this.circle && this.circle.setNativeProps(this._circleStyles)
  }

  _handleStartShouldSetPanResponder = (e: Object, gestureState: Object): boolean => {
    // Should we become active when the user presses down on the circle?
    return true
  }

  _handleMoveShouldSetPanResponder = (e: Object, gestureState: Object): boolean => {
    // Should we become active when the user moves a touch over the circle?
    return true
  }

  _handlePanResponderGrant = (e: Object, gestureState: Object) => {
    this._highlight()
  }

  _handlePanResponderMove = (e: Object, gestureState: Object) => {
    // this._circleStyles.style.left = this._previousLeft + gestureState.dx
    this._circleStyles.style.top = this._previousTop + gestureState.dy
    this.props.onDrag({
      left: this._previousLeft + gestureState.dx,
      top: this._previousTop + gestureState.dy,
    })
    this._updateNativeStyles()
  }

  _handlePanResponderEnd = (e: Object, gestureState: Object) => {
    this._unHighlight()
    this._previousLeft += gestureState.dx
    this._previousTop += gestureState.dy
    this.props.onDragComplete({
      left: this._previousLeft,
      top: this._previousTop,
    })
  }
}
