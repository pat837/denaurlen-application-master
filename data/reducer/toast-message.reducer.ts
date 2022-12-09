import { reducerActionType, toastMessageStateType } from '../../types'
import { toastActionsType } from '../actions/action-types'

const initialState: toastMessageStateType = {
  message: '',
  duration: 2500,
  show: false
}

const toastReducer = (state = initialState, action: reducerActionType): toastMessageStateType => {
  switch (action.type) {
    case toastActionsType.SHOW:
      return {
        ...state,
        message: action.payload,
        show: true
      }
    case toastActionsType.REMOVE:
      return { ...state, message: '', show: false }
    default:
      return state
  }
}

export default toastReducer
