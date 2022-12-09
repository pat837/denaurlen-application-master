import { appbarActionsTypes } from '../actions/action-types'

import type { appbarStateType, reducerActionType } from '../../types'

const { SET_TITLE, REMOVE_TITLE, SHOW_BACK_BUTTON, HIDE_BACK_BUTTON, SHOW_SEARCH, HIDE_SEARCH } =
  appbarActionsTypes

const initialState: appbarStateType = {
  showBackButton: false,
  title: '',
  showSearch: false
}

const appbarReducer = (state = initialState, { type, payload }: reducerActionType): appbarStateType => {
  switch (type) {
    case SET_TITLE:
      return {
        ...state,
        title: payload
      }
    case REMOVE_TITLE:
      return {
        ...state,
        title: ''
      }
    case SHOW_BACK_BUTTON:
      return {
        ...state,
        showBackButton: true
      }
    case HIDE_BACK_BUTTON:
      return {
        ...state,
        showBackButton: false
      }
    case SHOW_SEARCH:
      return {
        ...state,
        showSearch: true
      }
    case HIDE_SEARCH:
      return {
        ...state,
        showSearch: false
      }
    default:
      return state
  }
}

export default appbarReducer
