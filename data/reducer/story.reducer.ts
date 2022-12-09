import { storyActionsType } from '../actions/action-types'

import type { reducerActionType, storyStateType } from '../../types'
import type { Story_ } from '../../types/story.type'

const initStory: Story_ = {
  _id: '',
  caption: '',
  createdAt: new Date(),
  src: '',
  uploader: '',
  storyType: 'GENERAL',
  postId: '',
  updatedAt: new Date()
}

const initialState: storyStateType = {
  openStoryPopup: false,
  openStoryViewsPopup: false,
  user: {
    username: '',
    profilePic: ''
  },
  currentStory: initStory,
  currentStoryIndex: 0,
  toggleMore: () => {},
  openPremiumStory: false,
  openAgreePopup: false
}

const storyReducer = (state = initialState, action: reducerActionType): storyStateType => {
  switch (action.type) {
    case storyActionsType.OPEN_STORY_POPUP:
      return {
        ...state,
        openStoryPopup: true,
        user: action.payload
      }
    case storyActionsType.CLOSE_STORY_POPUP:
      return {
        ...state,
        user: {
          username: '',
          profilePic: ''
        },
        openStoryPopup: false,
        currentStory: initStory,
        openStoryViewsPopup: false,
        currentStoryIndex: 0,
        toggleMore: () => {},
        openPremiumStory: false,
        openAgreePopup: false
      }

    case storyActionsType.OPEN_STORY_VIEW_POPUP:
      return {
        ...state,
        openStoryPopup: false,
        currentStory: action.payload.story,
        openStoryViewsPopup: true,
        currentStoryIndex: action.payload.currentStory
      }
    case storyActionsType.CLOSE_STORY_VIEW_POPUP:
      return {
        ...state,
        openStoryPopup: true,
        openStoryViewsPopup: false
      }
    case storyActionsType.OPEN_PREMIUM_STORY:
      return {
        ...state,
        currentStory: action.payload.story,
        currentStoryIndex: action.payload.currentStory,
        openPremiumStory: true
      }
    case storyActionsType.CLOSE_PREMIUM_STORY:
      return {
        ...state,
        openPremiumStory: false,
        currentStoryIndex: state.currentStoryIndex + 1
      }
    case storyActionsType.OPEN_AGREE_POPUP:
      return {
        ...state,
        openAgreePopup: true,
        currentStory: action.payload.story,
        currentStoryIndex: action.payload.currentStory
      }
    case storyActionsType.CLOSE_AGREE_POPUP:
      return {
        ...state,
        openAgreePopup: false,
        currentStoryIndex: state.currentStoryIndex + 1
      }
    default:
      return state
  }
}

export default storyReducer
