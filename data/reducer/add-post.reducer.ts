import { addPostActionsTypes } from '../actions/action-types'

import type { addPostPopupState, reducerActionType } from '../../types'

const initialState: addPostPopupState = {
  showAddGeneralPost: false,
  showAddStory: false,
  showAddTop10s: false,
  showAddValuationPost: false,
  categoryId: '',
  categorySlot: 0,
  currentPage: ''
}

const addPostReducer = (
  state = initialState,
  { type, payload }: reducerActionType
): addPostPopupState => {
  switch (type) {
    case addPostActionsTypes.OPEN_GENERAL:
      return {
        ...state,
        showAddGeneralPost: true
      }
    case addPostActionsTypes.CLOSE_GENERAL:
      return {
        ...state,
        showAddGeneralPost: false
      }
    case addPostActionsTypes.CLOSE_STATUS:
      return {
        ...state,
        showAddStory: false
      }
    case addPostActionsTypes.OPEN_STATUS:
      return {
        ...state,
        showAddStory: true
      }
    case addPostActionsTypes.CLOSE_VALUATION:
      return {
        ...state,
        showAddValuationPost: false
      }
    case addPostActionsTypes.OPEN_VALUATION:
      return {
        ...state,
        showAddValuationPost: true
      }
    case addPostActionsTypes.CLOSE_TOP10S:
      return {
        ...state,
        showAddTop10s: false
      }
    case addPostActionsTypes.OPEN_TOP10S:
      return {
        ...state,
        showAddTop10s: true
      }
    case addPostActionsTypes.SELECT_CATEGORY:
      return {
        ...state,
        categoryId: payload
      }
    case addPostActionsTypes.SELECT_CATEGORY_SLOT:
      return {
        ...state,
        categorySlot: payload
      }
    case addPostActionsTypes.CLEAR_CATEGORY:
      return {
        ...state,
        categoryId: ''
      }
    case addPostActionsTypes.CLEAR_CATEGORY_SLOT:
      return {
        ...state,
        categorySlot: 0
      }
    case addPostActionsTypes.REMOVE_CATEGORY_AND_SLOT:
      return {
        ...state,
        categoryId: '',
        categorySlot: 0
      }
    case addPostActionsTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: payload
      }
    default:
      return state
  }
}

export default addPostReducer
