import type { navbarStateType, reducerActionType } from '../../types'
import { navbarActionsTypes } from '../actions/action-types'

const { SHOW_ADD_OPTION, HIDE_ADD_OPTION, SHOW_MENU, HIDE_MENU, SET_AUTO_HIDE } = navbarActionsTypes

const initialState: navbarStateType = {
  showAddOption: false,
  showMenu: false,
  autoHide: false
}

const navbarReducer = (
  state = initialState,
  { payload, type }: reducerActionType
): navbarStateType => {
  switch (type) {
    case SHOW_MENU:
      return { ...state, showMenu: true }
    case HIDE_MENU:
      return { ...state, showMenu: false }
    case SHOW_ADD_OPTION:
      return { ...state, showAddOption: true }
    case HIDE_ADD_OPTION:
      return { ...state, showAddOption: false }
    case SET_AUTO_HIDE:
      return { ...state, autoHide: payload }
    default:
      return state
  }
}

export default navbarReducer
