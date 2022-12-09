import graphColorPalettes, { PaletteType } from '../../config/graph-color-palette'
import { CoinWalletState, reducerActionType } from '../../types'
import { coinWalletActionsType } from '../actions/action-types'

const initialState: CoinWalletState = {
  palette: graphColorPalettes.purple,
  paletteName: 'ocean',
  stats: 'INCOMING',
  lastResetPinTime: undefined
}

const coinWalletReducer = (state = initialState, action: reducerActionType): CoinWalletState => {
  switch (action.type) {
    case coinWalletActionsType.setPalette:
      return {
        ...state,
        palette: graphColorPalettes[action.payload as PaletteType],
        paletteName: action.payload
      }
    case coinWalletActionsType.changeCoinStatsTab:
      return {
        ...state,
        stats: action.payload
      }
    case coinWalletActionsType.setLastResetPinDate:
      return {
        ...state,
        lastResetPinTime: action.payload
      }
    default:
      return state
  }
}

export default coinWalletReducer
