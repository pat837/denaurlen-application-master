export const profilePageActionTypes = {
  OPEN_FOLLOWERS_POPUP: 'OPEN_FOLLOWERS_POPUP',
  OPEN_FOLLOWING_POPUP: 'OPEN_FOLLOWING_POPUP',
  OPEN_MY_COMMUNITY_POPUP: 'OPEN_MY_COMMUNITY_POPUP',
  OPEN_COMMUNITY_POPUP: 'OPEN_COMMUNITY_POPUP',
  CLOSE_FOLLOWERS_POPUP: 'CLOSE_FOLLOWERS_POPUP',
  CLOSE_FOLLOWING_POPUP: 'CLOSE_FOLLOWING_POPUP',
  CLOSE_MY_COMMUNITY_POPUP: 'CLOSE_MY_COMMUNITY_POPUP',
  CLOSE_COMMUNITY_POPUP: 'CLOSE_COMMUNITY_POPUP',
  OPEN_EDIT_PROFILE_POPUP: 'OPEN_EDIT_PROFILE_POPUP',
  CLOSE_EDIT_PROFILE_POPUP: 'CLOSE_EDIT_PROFILE_POPUP',
  OPEN_PROFILE_PIC_EDIT: 'OPEN_PROFILE_PIC_EDIT',
  CLOSE_PROFILE_PIC_EDIT: 'CLOSE_PROFILE_PIC_EDIT',
  setPopup: 'set-popup'
} as const

export const appbarActionsTypes = {
  SET_TITLE: 'SET_TITLE',
  REMOVE_TITLE: 'REMOVE_TITLE',
  SHOW_BACK_BUTTON: 'SHOW_BACK_BUTTON',
  HIDE_BACK_BUTTON: 'HIDE_BACK_BUTTON',
  SHOW_SEARCH: 'SHOW_SEARCH',
  HIDE_SEARCH: 'HIDE_SEARCH'
} as const

export const navbarActionsTypes = {
  SHOW_MENU: 'SHOW_MENU',
  HIDE_MENU: 'HIDE_MENU',
  SHOW_ADD_OPTION: 'SHOW_ADD_OPTION',
  HIDE_ADD_OPTION: 'HIDE_ADD_OPTION',
  SET_AUTO_HIDE: 'SET_AUTO_HIDE'
} as const

export const addPostActionsTypes = {
  OPEN_GENERAL: 'OPEN_GENERAL',
  CLOSE_GENERAL: 'CLOSE_GENERAL',
  OPEN_STATUS: 'OPEN_STATUS',
  CLOSE_STATUS: 'CLOSE_STATUS',
  OPEN_TOP10S: 'OPEN_TOP10S',
  CLOSE_TOP10S: 'CLOSE_TOP10S',
  SELECT_CATEGORY: 'SELECT_CATEGORY',
  SELECT_CATEGORY_SLOT: 'SELECT_CATEGORY_SLOT',
  REMOVE_CATEGORY_AND_SLOT: 'REMOVE_CATEGORY_AND_SLOT',
  CLEAR_CATEGORY_SLOT: 'CLEAR_CATEGORY_SLOT',
  CLEAR_CATEGORY: 'CLEAR_CATEGORY',
  OPEN_VALUATION: 'OPEN_VALUATION',
  CLOSE_VALUATION: 'CLOSE_VALUATION',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE'
} as const

export const postActionsTypes = {
  SHOW_COMMENTS: 'SHOW_COMMENTS',
  HIDE_COMMENTS: 'HIDE_COMMENTS',
  SHOW_MORE_OPTIONS: 'SHOW_MORE_OPTIONS',
  HIDE_MORE_OPTIONS: 'HIDE_MORE_OPTIONS',
  SHOW_MORE_OPTIONS_WITH_EDIT: 'SHOW_MORE_OPTIONS_WITH_EDIT',
  HIDE_MORE_OPTIONS_WITH_EDIT: 'HIDE_MORE_OPTIONS_WITH_EDIT',
  SHOW_EDIT_OPTION: 'SHOW_EDIT_OPTION',
  HIDE_EDIT_OPTION: 'HIDE_EDIT_OPTION',
  SHOW_TAGGED: 'SHOW_TAGGED',
  HIDE_TAGGED: 'HIDE_TAGGED',
  TOGGLE_MUTE_VIDEO: 'TOGGLE_MUTE_VIDEO',
  OPEN_SPEND_POPUP: 'OPEN_SPEND_POPUP',
  CLOSE_SPEND_POPUP: 'CLOSE_SPEND_POPUP',
  OPEN_REVALUATE_POPUP: 'OPEN_REVALUATE_POPUP',
  CLOSE_REVALUATE_POPUP: 'CLOSE_REVALUATE_POPUP'
} as const

export const storyActionsType = {
  OPEN_STORY_POPUP: 'OPEN_STORY_POPUP',
  CLOSE_STORY_POPUP: 'CLOSE_STORY_POPUP',
  OPEN_STORY_VIEW_POPUP: 'OPEN_STORY_VIEW_POPUP',
  CLOSE_STORY_VIEW_POPUP: 'CLOSE_STORY_VIEW_POPUP',
  OPEN_PREMIUM_STORY: 'OPEN_PREMIUM_STORY',
  CLOSE_PREMIUM_STORY: 'CLOSE_PREMIUM_STORY',
  OPEN_AGREE_POPUP: 'OPEN_AGREE_POPUP',
  CLOSE_AGREE_POPUP: 'CLOSE_AGREE_POPUP'
} as const

export const toastActionsType = {
  SHOW: 'SHOW_TOAST',
  REMOVE: 'REMOVE_TOAST'
} as const

export const postPopupActionsType = {
  CLOSE_POST: 'CLOSE_POST',
  OPEN_GENERAL_POST: 'OPEN_GENERAL_POST',
  OPEN_CATEGORY_POST: 'OPEN_CATEGORY_POST',
  OPEN_VALUATION_POST: 'OPEN_VALUATION_POST'
} as const

export const categoryPageActionsType = {
  OPEN_SELECT: 'OPEN_SELECT',
  CLOSE_SELECT: 'CLOSE_SELECT',
  SET_CATEGORY: 'SET_CATEGORY'
} as const

export const BioPageActionsType = {
  BIO_TO_SHOW: 'BIO_TO_SHOW'
} as const

export const statsboardActionsType = {
  statsToShow: 'stats-to-show'
} as const

export const messagingActionsType = {
  setConversation: 'set-conversation',
  clearConversation: 'clear-conversation'
} as const

export const appActionsType = {
  activateZenMode: 'ON-ZEN-MODE',
  deactivateZenMode: 'OFF-ZEN-MODE',
  incrementInterestingClicks: 'increase-interesting-clicks',
  incrementFollowClicks: 'increase-follow-clicks',
  toggleInterestingPopup: 'toggle-interesting-popup',
  toggleFollowingPopup: 'toggle-following-popup',
  toggleAmbientBio: 'toggle-ambient-bio'
} as const

export const blocksPageActionsType = {
  changeTab: 'block-page-change-tab'
} as const

export const leaderboardActionsType = {
  changeTab: 'leaderboard-change-tab'
} as const

export const explorePageActionsType = {
  addInitialPost: 'add-initial-post'
} as const

export const coinWalletActionsType = {
  setPalette: 'set-palette',
  changeCoinStatsTab: 'change-coin-stats-tab',
  setLastResetPinDate: 'set-last-reset-pin-date'
}
