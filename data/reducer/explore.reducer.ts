import { reducerActionType, ExploreState_ } from '../../types'
import { explorePageActionsType } from '../actions/action-types'

const { addInitialPost } = explorePageActionsType

const initialState: ExploreState_ = {
  post: {
    _id: '',
    postType: 'GENERAL',
    caption: '',
    createdAt: new Date(),
    isVideo: false,
    place: '',
    ratio: 0,
    src: [],
    updatedAt: new Date(),
    uploader: {
      _id: '',
      profilePic: '',
      username: ''
    }
  }
}

const exploreReducer = (state = initialState, action: reducerActionType): ExploreState_ => {
  switch (action.type) {
    case addInitialPost:
      return {
        ...state,
        post: action.payload
      }

    default:
      return state
  }
}

export default exploreReducer
