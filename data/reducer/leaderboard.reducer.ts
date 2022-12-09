import { LeaderboardState_, reducerActionType } from '../../types'
import { leaderboardActionsType } from '../actions/action-types'

const initialState: LeaderboardState_ = {
  tab: 'global'
}

const leaderboardReducer = (state = initialState, action: reducerActionType): LeaderboardState_ => {
  const { payload, type } = action

  switch (type) {
    case leaderboardActionsType.changeTab:
      return {
        ...state,
        tab: payload
      }

    default:
      return state
  }
}

export default leaderboardReducer
