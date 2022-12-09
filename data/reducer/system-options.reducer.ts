import { appActionsType } from '../actions/action-types'

import type { reducerActionType, SystemOptions_ } from '../../types'

const initialState: SystemOptions_ = {
  zenMode: {
    isActive: false,
    on: false
  },
  confirmPopups: {
    interesting: {
      noOfClicks: 0,
      show: true
    },
    follow: {
      noOfClicks: 0,
      show: true
    }
  },
  ambientBio: false
}

const systemOptionsReducer = (state = initialState, action: reducerActionType): SystemOptions_ => {
  switch (action.type) {
    case appActionsType.activateZenMode:
      return {
        ...state,
        zenMode: {
          ...state.zenMode,
          isActive: true
        }
      }
    case appActionsType.deactivateZenMode:
      return {
        ...state,
        zenMode: {
          isActive: false,
          on: false
        }
      }
    case appActionsType.toggleInterestingPopup:
      return {
        ...state,
        confirmPopups: {
          ...state.confirmPopups,
          interesting: {
            ...state.confirmPopups.interesting,
            show: !state.confirmPopups.interesting.show
          }
        }
      }
    case appActionsType.toggleFollowingPopup:
      return {
        ...state,
        confirmPopups: {
          ...state.confirmPopups,
          follow: {
            ...state.confirmPopups.follow,
            show: !state.confirmPopups.follow.show
          }
        }
      }
    case appActionsType.incrementFollowClicks: {
      const count = state.confirmPopups.follow.noOfClicks + 1

      return {
        ...state,
        confirmPopups: {
          ...state.confirmPopups,
          follow: {
            noOfClicks: count,
            show: count >= 10 ? false : state.confirmPopups.follow.show
          }
        }
      }
    }
    case appActionsType.incrementInterestingClicks: {
      const count = state.confirmPopups.interesting.noOfClicks + 1

      return {
        ...state,
        confirmPopups: {
          ...state.confirmPopups,
          interesting: {
            noOfClicks: count,
            show: count >= 10 ? false : state.confirmPopups.interesting.show
          }
        }
      }
    }
    case appActionsType.toggleAmbientBio:
      return { ...state, ambientBio: !state?.ambientBio }
    default:
      return state
  }
}

export default systemOptionsReducer
