import { ReactNode } from 'react'

import {
  addPostActionsTypes,
  appActionsType,
  appbarActionsTypes,
  BioPageActionsType,
  blocksPageActionsType,
  categoryPageActionsType,
  coinWalletActionsType,
  explorePageActionsType,
  leaderboardActionsType,
  messagingActionsType,
  navbarActionsTypes,
  postActionsTypes,
  postPopupActionsType,
  profilePageActionTypes,
  statsboardActionsType,
  storyActionsType,
  toastActionsType
} from './action-types'

import type {
  BlockCoinsTab_,
  CoinStatsTab,
  editProfileType,
  LeaderboardType_ as LeaderboardTab_,
  ProfilePopup_,
  Stats_
} from '../../types'
import type { CategoryPost_ } from '../../types/category-post.type'
import type { GeneralPost_ } from '../../types/general-post.types'
import type { Conversation_ } from '../../types/messaging.types'
import type { Story_ } from '../../types/story.type'
import type { ValuationPost_ } from '../../types/valuation-post.type'
import type { PaletteType } from '../../config/graph-color-palette'

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

export const profilePageActions = {
  openFollowers: () => ({ type: OPEN_FOLLOWERS_POPUP, payload: null }),
  closeFollowers: () => ({ type: CLOSE_FOLLOWERS_POPUP, payload: null }),
  openFollowing: () => ({ type: OPEN_FOLLOWING_POPUP, payload: null }),
  closeFollowing: () => ({ type: CLOSE_FOLLOWING_POPUP, payload: null }),
  openMyCommunity: () => ({ type: OPEN_MY_COMMUNITY_POPUP, payload: null }),
  closeMyCommunity: () => ({ type: CLOSE_MY_COMMUNITY_POPUP, payload: null }),
  openCommunity: () => ({ type: OPEN_COMMUNITY_POPUP, payload: null }),
  closeCommunity: () => ({ type: CLOSE_COMMUNITY_POPUP, payload: null }),
  openEditProfile: (profile: editProfileType) => ({
    type: OPEN_EDIT_PROFILE_POPUP,
    payload: profile
  }),
  closeEditProfile: () => ({ type: CLOSE_EDIT_PROFILE_POPUP, payload: null }),
  openEditProfilePic: () => ({ type: OPEN_PROFILE_PIC_EDIT, payload: null }),
  closeEditProfilePic: () => ({ type: CLOSE_PROFILE_PIC_EDIT, payload: null }),
  setPopup: (popup: ProfilePopup_) => ({
    type: setPopup,
    payload: popup
  })
}

const { SET_TITLE, REMOVE_TITLE, SHOW_BACK_BUTTON, HIDE_BACK_BUTTON, SHOW_SEARCH, HIDE_SEARCH } = appbarActionsTypes

export const appbarActions = {
  setTitle: (title: string | ReactNode) => ({ type: SET_TITLE, payload: title }),
  removeTitle: () => ({ type: REMOVE_TITLE, payload: null }),
  showBackButton: () => ({ type: SHOW_BACK_BUTTON, payload: null }),
  hideBackButton: () => ({ type: HIDE_BACK_BUTTON, payload: null }),
  openSearch: () => ({ type: SHOW_SEARCH, payload: null }),
  closeSearch: () => ({ type: HIDE_SEARCH, payload: null })
}

export const navbarActions = {
  openMenu: () => ({
    type: navbarActionsTypes.SHOW_MENU,
    payload: null
  }),
  closeMenu: () => ({
    type: navbarActionsTypes.HIDE_MENU,
    payload: null
  }),
  openAddOption: () => ({
    type: navbarActionsTypes.SHOW_ADD_OPTION,
    payload: null
  }),
  closeAddOption: () => ({
    type: navbarActionsTypes.HIDE_ADD_OPTION,
    payload: null
  }),
  setAutoHide: (autoHide: boolean) => ({
    type: navbarActionsTypes.SET_AUTO_HIDE,
    payload: autoHide
  })
}

export const addPostActions = {
  setCurrentPage: (path: string) => ({
    type: addPostActionsTypes.SET_CURRENT_PAGE,
    payload: path
  }),
  openAddGeneralPost: () => ({
    type: addPostActionsTypes.OPEN_GENERAL,
    payload: null
  }),
  closeAddGeneralPost: () => ({
    type: addPostActionsTypes.CLOSE_GENERAL,
    payload: null
  }),
  openAddTop10s: () => ({
    type: addPostActionsTypes.OPEN_TOP10S,
    payload: null
  }),
  closeAddTop10s: () => ({
    type: addPostActionsTypes.CLOSE_TOP10S,
    payload: null
  }),
  selectCategory: (categoryId: string) => ({
    type: addPostActionsTypes.SELECT_CATEGORY,
    payload: categoryId
  }),
  selectCategorySlot: (slot: number) => ({
    type: addPostActionsTypes.SELECT_CATEGORY_SLOT,
    payload: slot
  }),
  clearCategoryAndSlot: () => ({
    type: addPostActionsTypes.REMOVE_CATEGORY_AND_SLOT,
    payload: null
  }),
  clearCategory: () => ({
    type: addPostActionsTypes.CLEAR_CATEGORY,
    payload: null
  }),
  clearCategorySlot: () => ({
    type: addPostActionsTypes.CLEAR_CATEGORY_SLOT,
    payload: null
  }),
  openAddStory: () => ({
    type: addPostActionsTypes.OPEN_STATUS,
    payload: null
  }),
  closeAddStory: () => ({
    type: addPostActionsTypes.CLOSE_STATUS,
    payload: null
  }),
  openAddValuationPost: () => ({
    type: addPostActionsTypes.OPEN_VALUATION,
    payload: null
  }),
  closeAddValuationPost: () => ({
    type: addPostActionsTypes.CLOSE_VALUATION,
    payload: null
  })
}

type postType = 'GENERAL' | 'CATEGORY' | 'VALUATION'

export const postActions = {
  showComments: (postId: string, typeOfPost: postType = 'GENERAL') => ({
    type: postActionsTypes.SHOW_COMMENTS,
    payload: { postId, typeOfPost }
  }),
  hideComment: () => ({
    type: postActionsTypes.HIDE_COMMENTS,
    payload: null
  }),
  showMoreOptions: (postId: string, userId: string, typeOfPost: postType = 'GENERAL') => ({
    type: postActionsTypes.SHOW_MORE_OPTIONS,
    payload: { postId, typeOfPost, userId }
  }),
  hideMoreOptions: () => ({
    type: postActionsTypes.HIDE_MORE_OPTIONS,
    payload: null
  }),
  showMoreOptionsWithEdit: ({
    postId,
    caption = '',
    title = '',
    link = '',
    categoryId = '',
    typeOfPost = 'GENERAL'
  }: {
    postId: string
    caption: string
    title?: string
    link?: string
    categoryId?: string
    typeOfPost?: postType
  }) => ({
    type: postActionsTypes.SHOW_MORE_OPTIONS_WITH_EDIT,
    payload: { postId, typeOfPost, caption, title, link, categoryId }
  }),
  hideMoreOptionsWithEdit: () => ({
    type: postActionsTypes.HIDE_MORE_OPTIONS_WITH_EDIT,
    payload: null
  }),
  showEditOption: () => ({
    type: postActionsTypes.SHOW_EDIT_OPTION,
    payload: null
  }),
  hideEditOption: () => ({
    type: postActionsTypes.HIDE_EDIT_OPTION,
    payload: null
  }),
  showTags: (postId: string) => ({
    type: postActionsTypes.SHOW_TAGGED,
    payload: postId
  }),
  hideTags: () => ({
    type: postActionsTypes.HIDE_TAGGED,
    payload: null
  }),
  toggleVideoAudio: () => ({
    type: postActionsTypes.TOGGLE_MUTE_VIDEO,
    payload: null
  }),
  showSpendPopup: (postId: string) => ({
    type: postActionsTypes.OPEN_SPEND_POPUP,
    payload: postId
  }),
  closeSpendPopup: () => ({
    type: postActionsTypes.OPEN_SPEND_POPUP,
    payload: null
  }),
  openRevaluationPopup: (payload: { postId: string; type: 'INFINITE' | 'REVERT'; baseValue: number }) => ({
    type: postActionsTypes.OPEN_REVALUATE_POPUP,
    payload
  }),
  closeRevaluationPopup: () => ({
    type: postActionsTypes.CLOSE_REVALUATE_POPUP,
    payload: null
  })
}

export const storyActions = {
  openStoryPopup: (user: { username: string; profilePic: string }) => ({
    payload: user,
    type: storyActionsType.OPEN_STORY_POPUP
  }),
  closeStoryPopup: () => ({
    payload: null,
    type: storyActionsType.CLOSE_STORY_POPUP
  }),
  openStoryViewPopup: (story: Story_, currentStory: number, toggleMore: any) => ({
    payload: { story, currentStory, toggleMore },
    type: storyActionsType.OPEN_STORY_VIEW_POPUP
  }),
  closeStoryViewPopup: () => ({
    payload: null,
    type: storyActionsType.CLOSE_STORY_VIEW_POPUP
  }),
  openPremiumStory: (
    story: {
      _id: string
      uploader: string
      src: string
      caption: string
      stats: {
        isViewed?: boolean
        views?: number
        isAgree?: boolean
        isSpend?: boolean
      }
      createdAt: Date
      type: 'GENERAL' | 'PREMIUM'
    },
    currentStory: number,
    toggleMore: any
  ) => ({
    payload: { story, currentStory },
    type: storyActionsType.OPEN_PREMIUM_STORY
  }),
  closePremiumStory: () => ({
    payload: null,
    type: storyActionsType.CLOSE_PREMIUM_STORY
  }),
  openAgreePopup: (
    story: {
      _id: string
      uploader: string
      src: string
      caption: string
      stats: {
        isViewed?: boolean
        views?: number
        isAgree?: boolean
        isSpend?: boolean
      }
      createdAt: Date
      type: 'GENERAL' | 'PREMIUM'
    },
    currentStory: number,
    toggleMore: any
  ) => ({
    payload: { story, currentStory, toggleMore },
    type: storyActionsType.OPEN_AGREE_POPUP
  }),
  closeAgreePopup: () => ({ payload: null, type: storyActionsType.CLOSE_AGREE_POPUP })
}

export const toastActions = {
  showToast: (message: ReactNode | string) => ({ type: toastActionsType.SHOW, payload: message }),
  removeToast: () => ({ type: toastActionsType.REMOVE, payload: null })
}

export const postPopupActions = {
  openGeneralPost: (post: GeneralPost_) => ({
    type: postPopupActionsType.OPEN_GENERAL_POST,
    payload: post
  }),
  openCategoryPost: (post: CategoryPost_) => ({
    type: postPopupActionsType.OPEN_CATEGORY_POST,
    payload: post
  }),
  openValuationPost: (post: ValuationPost_) => ({
    type: postPopupActionsType.OPEN_VALUATION_POST,
    payload: post
  }),
  closePost: () => ({
    type: postPopupActionsType.CLOSE_POST,
    payload: null
  })
}

export const categoryPageActions = {
  openSelectMenu: () => ({
    type: categoryPageActionsType.OPEN_SELECT,
    payload: null
  }),
  closeSelectMenu: () => ({
    type: categoryPageActionsType.CLOSE_SELECT,
    payload: null
  }),
  setCurrentCategory: (categoryId: string) => ({
    type: categoryPageActionsType.SET_CATEGORY,
    payload: categoryId
  })
}

export const BioActions = {
  bioToShow: (type: 'ALL' | 'OWNED') => ({
    type: BioPageActionsType.BIO_TO_SHOW,
    payload: type
  })
}

export const messageActions = {
  setConversation: (conversation: Conversation_) => ({
    type: messagingActionsType.setConversation,
    payload: conversation
  }),
  clearConversation: () => ({
    type: messagingActionsType.clearConversation,
    payload: null
  })
}

export const statsboardActions = {
  statsToShow: (stats: Stats_) => ({
    type: statsboardActionsType.statsToShow,
    payload: stats
  })
}

export const blocksPageActions = {
  changeTab: (tab: BlockCoinsTab_) => ({
    type: blocksPageActionsType.changeTab,
    payload: tab
  })
}

export const leaderboardActions = {
  changeTab: (tab: LeaderboardTab_) => ({
    type: leaderboardActionsType.changeTab,
    payload: tab
  })
}

export const systemOptionsActions = {
  zenMode: {
    activate: () => ({ type: appActionsType.activateZenMode, payload: null }),
    deactivate: () => ({ type: appActionsType.deactivateZenMode, payload: null })
  },
  confirmPopups: {
    interesting: {
      incrementClicks: () => ({ type: appActionsType.incrementInterestingClicks, payload: null }),
      toggle: () => ({ type: appActionsType.toggleInterestingPopup, payload: null })
    },
    follow: {
      incrementClicks: () => ({ type: appActionsType.incrementFollowClicks, payload: null }),
      toggle: () => ({ type: appActionsType.toggleFollowingPopup, payload: null })
    }
  },
  layoutSettings: {
    toggleAmbientBio: () => ({ type: appActionsType.toggleAmbientBio, payload: undefined })
  }
}

export const explorePageActions = {
  setInitialPost: (
    post:
      | (ValuationPost_ & { postType: 'VALUATION' })
      | (GeneralPost_ & { postType: 'GENERAL' })
      | (CategoryPost_ & { postType: 'TOP10'; priority: number })
  ) => ({ type: explorePageActionsType.addInitialPost, payload: post })
}

export const coinWalletActions = {
  setPallet: (palette: PaletteType) => ({ type: coinWalletActionsType.setPalette, payload: palette }),
  changeCoinStatsTab: (tab: CoinStatsTab) => ({ type: coinWalletActionsType.changeCoinStatsTab, payload: tab }),
  setResetPinDate: (date: Date) => ({ type: coinWalletActionsType.setLastResetPinDate, payload: date })
}
