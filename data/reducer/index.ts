import { combineReducers } from 'redux'

import addPostReducer from './add-post.reducer'
import appbarReducer from './appbar.reducer'
import bioReducer from './bio.reducer'
import blockCoinsReducer from './block-coins.reducer'
import categoryPageReducer from './category-page.reducer'
import coinWalletReducer from './coin-wallet.reducer'
import exploreReducer from './explore.reducer'
import leaderboardReducer from './leaderboard.reducer'
import messageReducer from './messaging.reducer'
import navbarReducer from './navbar.reducer'
import postPopupReducer from './post-popup.reducer'
import postReducer from './post.reducer'
import profilePageReducer from './profile-page.reducer'
import statsboardReducer from './statsboard.reducer'
import storyReducer from './story.reducer'
import systemOptionsReducer from './system-options.reducer'
import toastReducer from './toast-message.reducer'

const rootReducer = combineReducers({
  profilePage: profilePageReducer,
  appbar: appbarReducer,
  navbar: navbarReducer,
  addPostPopup: addPostReducer,
  postState: postReducer,
  storyState: storyReducer,
  toastState: toastReducer,
  postPopupState: postPopupReducer,
  categoryPageState: categoryPageReducer,
  bioState: bioReducer,
  messagingState: messageReducer,
  systemOptions: systemOptionsReducer,
  statsboardState: statsboardReducer,
  blockCoins: blockCoinsReducer,
  explore: exploreReducer,
  leaderboard: leaderboardReducer,
  coinWallet: coinWalletReducer
})

export default rootReducer
