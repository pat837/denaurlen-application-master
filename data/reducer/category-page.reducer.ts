import { CategoriesPageState_ as State_, reducerActionType } from '../../types'
import { categoryPageActionsType } from '../actions/action-types'

const { CLOSE_SELECT, OPEN_SELECT, SET_CATEGORY } = categoryPageActionsType

const initialState: State_ = {
  openSelectCategory: false,
  currentCategory: ''
}

const categoryPageReducer = (state = initialState, action: reducerActionType): State_ => {
  const { payload, type } = action

  switch (type) {
    case OPEN_SELECT:
      return {
        ...state,
        openSelectCategory: true
      }
    case CLOSE_SELECT:
      return {
        ...state,
        openSelectCategory: false
      }
    case SET_CATEGORY:
      return {
        ...state,
        currentCategory: payload
      }
    default:
      return state
  }
}

export default categoryPageReducer
