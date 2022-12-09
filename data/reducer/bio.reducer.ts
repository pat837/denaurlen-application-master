import { BioPageActionsType } from '../actions/action-types'

import type { BioState_, reducerActionType } from '../../types'

const initialState: BioState_ = {
  biosToShow: 'OWNED'
}

const bioReducer = (state = initialState, action: reducerActionType): BioState_ => {
  const { payload, type } = action

  switch (type) {
    case BioPageActionsType.BIO_TO_SHOW:
      return {
        ...state,
        biosToShow: payload
      }

    default:
      return state
  }
}

export default bioReducer
