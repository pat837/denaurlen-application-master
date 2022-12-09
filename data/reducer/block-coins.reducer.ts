import { blocksPageActionsType } from '../actions/action-types'

import type { BlockCoinsPage_, reducerActionType } from '../../types'

const { changeTab } = blocksPageActionsType

const initialState: BlockCoinsPage_ = {
  tab: 'blocked'
}

const blockCoinsReducer = (state = initialState, action: reducerActionType): BlockCoinsPage_ => {
  switch (action.type) {
    case changeTab:
      return {
        ...state,
        tab: action.payload
      }

    default:
      return state
  }
}

export default blockCoinsReducer
