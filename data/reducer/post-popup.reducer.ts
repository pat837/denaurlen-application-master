import { PostPopupState_, reducerActionType } from '../../types'
import { CategoryPost_ } from '../../types/category-post.type'
import { GeneralPost_ } from '../../types/general-post.types'
import { ValuationPost_ } from '../../types/valuation-post.type'

import { postPopupActionsType } from '../actions/action-types'

const initialGeneralPost: GeneralPost_ = {
  _id: '',
  caption: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  place: '',
  ratio: 1,
  src: [],
  uploader: {
    _id: '',
    profilePic: '',
    username: ''
  },
  isVideo: false
}

const initialCategoryPost: CategoryPost_ = {
  _id: '',
  caption: '',
  category: {
    _id: '',
    name: '',
    src: ''
  },
  createdAt: new Date(),
  ratio: '',
  slot: 0,
  src: [],
  title: '',
  uploader: {
    _id: '',
    profilePic: '',
    username: ''
  },
  url: ''
}

const initialValuationPost: ValuationPost_ = {
  _id: '',
  baseValue: 0,
  caption: '',
  createdAt: new Date(),
  place: '',
  postKeeper: {
    _id: '',
    profilePic: '',
    username: ''
  },
  ratio: 1,
  src: [],
  status: 'ACTIVE',
  uploader: {
    _id: '',
    profilePic: '',
    username: ''
  },
  highestValuer: '',
  netWorth: 0
}

const initialState: PostPopupState_ = {
  openGeneralPost: false,
  openCategoryPost: false,
  openValuationPost: false,
  generalPost: initialGeneralPost,
  categoryPost: initialCategoryPost,
  valuationPost: initialValuationPost
}

const postPopupReducer = (state = initialState, action: reducerActionType): PostPopupState_ => {
  const { type, payload } = action

  switch (type) {
    case postPopupActionsType.OPEN_GENERAL_POST:
      return {
        ...state,
        openGeneralPost: true,
        generalPost: payload
      }

    case postPopupActionsType.OPEN_CATEGORY_POST:
      return {
        ...state,
        openCategoryPost: true,
        categoryPost: payload
      }

    case postPopupActionsType.CLOSE_POST:
      return initialState

    case postPopupActionsType.OPEN_VALUATION_POST:
      return {
        ...state,
        valuationPost: payload,
        openValuationPost: true
      }

    default:
      return state
  }
}

export default postPopupReducer
