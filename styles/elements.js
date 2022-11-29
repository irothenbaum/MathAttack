import {black} from './colors'
import {spaceDefault, spaceSmall} from './layout'
import {font3} from './typography'

export const ScreenContainer = {
  height: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
}

export const RoundBox = {
  backgroundColor: 'transparent',
  padding: spaceDefault,
  borderRadius: spaceSmall,
  alignItems: 'center',
  justifyContent: 'center',
}

export const FullScreenOverlay = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  alignItems: 'center',
  justifyContent: 'center',
}

export const TextShadowSoft = {
  textShadowOffset: {width: -1, height: 3},
  textShadowRadius: 10,
}

export const BoxShadow = {
  shadowColor: black,
  shadowOffset: {
    width: 5,
    height: 0.35,
  },
  shadowOpacity: 0.5,
  shadowRadius: 4,
  elevation: 5,
}

export const InputStyles = {
  container: {
    marginBottom: spaceDefault,
  },
  input: {
    fontSize: font3,
  },
  label: {
    opacity: 0.5,
  },
  inputFrame: {
    borderWidth: 1,
    borderRadius: 4,
  },
}
