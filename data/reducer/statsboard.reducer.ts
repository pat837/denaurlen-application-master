import { statsboardActionsType } from '../actions/action-types'

import type { reducerActionType, StatsboardState_ } from '../../types'

const initialState: StatsboardState_ = {
  statsToShow: 'UPLOADER'
}

const statsboardReducer = (state = initialState, action: reducerActionType): StatsboardState_ => {
  const { payload, type } = action

  switch (type) {
    case statsboardActionsType.statsToShow:
      return {
        ...state,
        statsToShow: payload
      }

    default:
      return state
  }
}

export default statsboardReducer
