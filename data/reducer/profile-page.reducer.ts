import { editProfileType, profilePageState, reducerActionType } from '../../types'
import { profilePageActionTypes } from '../actions/action-types'

const {
  OPEN_COMMUNITY_POPUP,
  OPEN_FOLLOWERS_POPUP,
  OPEN_FOLLOWING_POPUP,
  OPEN_MY_COMMUNITY_POPUP,
  CLOSE_COMMUNITY_POPUP,
  CLOSE_FOLLOWERS_POPUP,
  CLOSE_FOLLOWING_POPUP,
  CLOSE_MY_COMMUNITY_POPUP,
  OPEN_EDIT_PROFILE_POPUP,
  CLOSE_EDIT_PROFILE_POPUP,
  OPEN_PROFILE_PIC_EDIT,
  CLOSE_PROFILE_PIC_EDIT,
  setPopup
} = profilePageActionTypes

const initialState: profilePageState = {
  isCommunityPopupOpen: false,
  isFollowerPopupOpen: false,
  isFollowingPopupOpen: false,
  isMyCommunityPopupOpen: false,
  isEditProfileOpen: false,
  isEditProfilePicOpen: false,
  editProfile: {
    name: '',
    dateOfBirth: new Date(),
    email: '',
    gender: 'MALE',
    location: { type: 'Point', coordinates: [] },
    profilePic: '',
    username: '',
    place: '',
    country: '',
    countryCode: ''
  },
  popup: 'none'
}

const profilePageReducer = (
  state = initialState,
  { type, payload }: reducerActionType
): profilePageState => {
  const initialEditProfile: editProfileType = {
    name: '',
    dateOfBirth: new Date(),
    email: '',
    gender: 'MALE',
    location: { type: 'Point', coordinates: [] },
    profilePic: '',
    username: '',
    place: '',
    country: '',
    countryCode: ''
  }

  switch (type) {
    case OPEN_COMMUNITY_POPUP:
      return {
        ...state,
        isCommunityPopupOpen: true
      }
    case CLOSE_COMMUNITY_POPUP:
      return {
        ...state,
        isCommunityPopupOpen: false
      }
    case OPEN_MY_COMMUNITY_POPUP:
      return {
        ...state,
        isMyCommunityPopupOpen: true
      }
    case CLOSE_MY_COMMUNITY_POPUP:
      return {
        ...state,
        isMyCommunityPopupOpen: false
      }
    case OPEN_FOLLOWERS_POPUP:
      return {
        ...state,
        isFollowerPopupOpen: true
      }
    case CLOSE_FOLLOWERS_POPUP:
      return {
        ...state,
        isFollowerPopupOpen: false
      }
    case OPEN_FOLLOWING_POPUP:
      return {
        ...state,
        isFollowingPopupOpen: true
      }
    case CLOSE_FOLLOWING_POPUP:
      return {
        ...state,
        isFollowingPopupOpen: false
      }
    case OPEN_EDIT_PROFILE_POPUP:
      return {
        ...state,
        isEditProfileOpen: true,
        editProfile: payload
      }
    case CLOSE_EDIT_PROFILE_POPUP:
      return {
        ...state,
        isEditProfileOpen: false,
        editProfile: initialEditProfile
      }
    case OPEN_PROFILE_PIC_EDIT:
      return {
        ...state,
        isEditProfilePicOpen: true,
        isEditProfileOpen: false
      }
    case CLOSE_PROFILE_PIC_EDIT:
      return {
        ...state,
        isEditProfilePicOpen: false,
        editProfile: initialEditProfile
      }
    case setPopup:
      return {
        ...state,
        popup: payload
      }
    default:
      return state
  }
}

export default profilePageReducer
