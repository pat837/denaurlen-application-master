import { postStateType, reducerActionType } from '../../types'
import { postActionsTypes } from '../actions/action-types'

const initialState: postStateType = {
  commentsFor: '',
  moreOptionsFor: '',
  moreOptionsWithEditFor: '',
  tagsFor: '',
  postType: 'GENERAL',
  showEdit: false,
  caption: '',
  title: '',
  link: '',
  isMuted: false,
  categoryId: '',
  userId: '',
  spendFor: '',
  revalueFor: '',
  revalueType: 'INFINITE',
  revalueAmount: 0
}

const postReducer = (state = initialState, { type, payload }: reducerActionType): postStateType => {
  switch (type) {
    case postActionsTypes.SHOW_COMMENTS:
      return {
        ...state,
        commentsFor: payload.postId,
        postType: payload.typeOfPost
      }
    case postActionsTypes.HIDE_COMMENTS:
      return {
        ...state,
        commentsFor: '',
        postType: 'GENERAL'
      }
    case postActionsTypes.SHOW_MORE_OPTIONS:
      return {
        ...state,
        moreOptionsFor: payload.postId,
        postType: payload.typeOfPost,
        userId: payload.userId
      }
    case postActionsTypes.HIDE_MORE_OPTIONS:
      return {
        ...state,
        moreOptionsFor: '',
        postType: 'GENERAL',
        userId: ''
      }
    case postActionsTypes.SHOW_MORE_OPTIONS_WITH_EDIT:
      return {
        ...state,
        moreOptionsWithEditFor: payload.postId,
        postType: payload.typeOfPost,
        caption: payload.caption,
        link: payload.link,
        title: payload.title,
        categoryId: payload.categoryId
      }
    case postActionsTypes.HIDE_MORE_OPTIONS_WITH_EDIT:
      return {
        ...state,
        moreOptionsWithEditFor: '',
        caption: '',
        link: '',
        title: '',
      }
    case postActionsTypes.SHOW_TAGGED:
      return {
        ...state,
        tagsFor: payload
      }
    case postActionsTypes.HIDE_TAGGED:
      return {
        ...state,
        tagsFor: ''
      }
    case postActionsTypes.SHOW_EDIT_OPTION:
      return { ...state, showEdit: true }
    case postActionsTypes.HIDE_EDIT_OPTION:
      return { ...state, showEdit: false }

    case postActionsTypes.TOGGLE_MUTE_VIDEO:
      return { ...state, isMuted: !state.isMuted }

    case postActionsTypes.OPEN_SPEND_POPUP:
      return { ...state, spendFor: payload }

    case postActionsTypes.CLOSE_SPEND_POPUP:
      return { ...state, spendFor: '' }

    case postActionsTypes.OPEN_REVALUATE_POPUP:
      return {
        ...state,
        revalueFor: payload.postId,
        revalueType: payload.type,
        revalueAmount: payload.baseValue
      }

    case postActionsTypes.CLOSE_REVALUATE_POPUP:
      return {
        ...state,
        revalueFor: '',
        revalueAmount: 0
      }

    default:
      return state
  }
}

export default postReducer
