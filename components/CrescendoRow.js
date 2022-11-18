import React from 'react'
import PropTypes from 'prop-types'
import {Animated, Pressable, StyleSheet, View} from 'react-native'
import {getScreenPositionFromLayoutEvent, getFlashStylesForAnimation, termStrToTerm} from '../lib/utilities'
import useColorsControl from '../hooks/useColorsControl'
import UIText from './UIText'
import {spaceSmall} from '../styles/layout'
import {RoundBox} from '../styles/elements'
import ClickHereTip from './UI/ClickHereTip'

// ---------------------------------------------------------------------

function Term(props) {
  const {operation, term} = termStrToTerm(props.termStr)
  const {green, foreground, background} = useColorsControl()

  const handleLayout = (e) => getScreenPositionFromLayoutEvent(e).then(props.onRendered)

  return (
    <Pressable onPress={() => props.onPress(props.termStr)}>
      <View
        style={[
          styles.singleTermContainer,
          {
            backgroundColor: props.isSelected ? props.selectedColor || green : 'transparent',
          },
        ]}
        onLayout={handleLayout}
      >
        {props.children}
        <UIText style={{zIndex: 2, color: props.isSelected ? background : foreground}}>
          {operation} {term}
        </UIText>
      </View>
    </Pressable>
  )
}

Term.propTypes = {
  termStr: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  selectedColor: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  onRendered: PropTypes.func,
  isDisabled: PropTypes.bool,
}

// ---------------------------------------------------------------------
function CrescendoRow(props) {
  const {red, green, background} = useColorsControl()

  return (
    <View style={styles.termsRow}>
      <ClickHereTip show={props.showTip} />

      {props.termsArr.map((t, termIndex) => {
        const shouldFlash = props.isShowingResult && props.resultAnimation && props.correctTerms.includes(t)
        return (
          <Term
            termStr={t}
            key={`${termIndex}-${t}`}
            isSelected={shouldFlash || props.isTermSelected(t)}
            selectedColor={shouldFlash && !props.isResultCorrect ? red : green}
            onRendered={(screenPos) => props.onRenderedTerm(screenPos, t)}
            onPress={props.onPressTerm}
            isDisabled={props.isDisabled}
          >
            {shouldFlash && (
              <Animated.View
                style={[
                  styles.resultFlashOverlay,
                  {
                    backgroundColor: background,
                    ...getFlashStylesForAnimation(props.resultAnimation),
                  },
                ]}
              />
            )}
          </Term>
        )
      })}
    </View>
  )
}

CrescendoRow.propTypes = {
  termsArr: PropTypes.array.isRequired,
  correctTerms: PropTypes.array.isRequired,
  onRenderedTerm: PropTypes.func.isRequired,
  onPressTerm: PropTypes.func.isRequired,
  isTermSelected: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  showTip: PropTypes.bool,
}

const styles = StyleSheet.create({
  singleTermContainer: {
    ...RoundBox,
    padding: spaceSmall,
  },

  termsRow: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    paddingVertical: spaceSmall,
  },

  resultFlashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: spaceSmall,
  },
})

export default CrescendoRow
