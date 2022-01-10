import {transparent} from './colors'
import {spaceDefault, spaceSmall} from './layout'

export const RoundBox = {
  backgroundColor: transparent,
  padding: spaceDefault,
  borderRadius: spaceSmall,
  alignItems: 'center',
  justifyContent: 'center',
}

export const FullScreenOverlay = {
  height: '100%',
  width: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  alignItems: 'center',
  justifyContent: 'center',
}

export const TextShadowSoft = {
  textShadowOffset: {width: -1, height: 3},
  textShadowRadius: 10,
}
