import { AxiosError, AxiosResponse } from 'axios'
import { NextComponentType, NextPageContext } from 'next'
import { AppInitialProps } from 'next/app'
import { Router } from 'next/router'
import { FC, ReactNode } from 'react'
import { PaletteType } from '../config/graph-color-palette'

import { CategoryPost_ } from './category-post.type'
import { GeneralPost_ } from './general-post.types'
import { Conversation_ } from './messaging.types'
import { Story_ } from './story.type'
import { ValuationPost_ } from './valuation-post.type'

export type AppProps<P = {}> = AppInitialProps & {
  Component: NextComponentType<NextPageContext, any, P> & {
    Layout?: ({ children }: { children: ReactNode | FC }) => JSX.Element
    isInSecure?: boolean
  }
  router: Router
  __N_SSG?: boolean | undefined
  __N_SSP?: boolean | undefined
  __N_RSC?: boolean | undefined
}

export type landingPageSectionType = {
  id: number
  title: string
  Img: FC
}

export type categoryType = {
  _id: string
  src: string
  name: string
}

export type categoryIconType = {
  link: string
  title: string
}

export type getBalanceType = {
  balance: number
  blockedCoins: number
  totalCoins: number
}

export type AddButtonProps = {
  label: string
  onClick: () => any
  icon: ReactNode
}

export type CategoryCardProps = {
  item: categoryIconType
  id: number
  handleClick: (id: number) => void
  getList: () => number[]
  changed: boolean
}

export type appbarStateType = {
  showBackButton: boolean
  title: string
  showSearch: boolean
}

export type navbarStateType = {
  showMenu: boolean
  showAddOption: boolean
  autoHide: boolean
}

export type storyStateType = {
  openStoryPopup: boolean
  openStoryViewsPopup: boolean
  user: {
    username: string
    profilePic: string
  }
  currentStory: Story_
  currentStoryIndex: number
  toggleMore: any
  openPremiumStory: boolean
  openAgreePopup: boolean
}

export type MessagingState_ = {
  conversation: Conversation_
}

export type userType = {
  username: string
  name: string
  email: string
  categories: number
  profilePic?: string
}

export type profileType = {
  dateOfBirth: Date
  email: string
  gender: 'MALE' | 'FEMALE' | 'OTHERS'
  location: { type: 'Point'; coordinates: number[] }
  name: string
  profilePic: string
  username: string
  bio: {
    name: string
    src: string
  }
  place: string
  country: string
  countryCode: string
  wallet?: number
  isVerified?: boolean
}

export type editProfileType = {
  dateOfBirth: Date
  email: string
  gender: 'MALE' | 'FEMALE' | 'OTHERS'
  location: { type: 'Point'; coordinates: number[] }
  name: string
  profilePic: string
  username: string
  place: string
  country: string
  countryCode: string
}
export type ProfilePopup_ = 'followers' | 'following' | 'community' | 'my-community' | 'none'
export type profilePageState = {
  isFollowerPopupOpen: boolean
  isFollowingPopupOpen: boolean
  isMyCommunityPopupOpen: boolean
  isCommunityPopupOpen: boolean
  isEditProfileOpen: boolean
  isEditProfilePicOpen: boolean
  editProfile: editProfileType
  popup: ProfilePopup_
}

export type addPostPopupState = {
  showAddGeneralPost: boolean
  showAddStory: boolean
  showAddTop10s: boolean
  showAddValuationPost: boolean
  categoryId: string
  categorySlot: number
  currentPage: string
}

export type postStateType = {
  commentsFor: string
  moreOptionsFor: string
  moreOptionsWithEditFor: string
  tagsFor: string
  showEdit: boolean
  postType: 'GENERAL' | 'CATEGORY' | 'VALUATION'
  caption: string
  title: string
  link: string
  isMuted: boolean
  categoryId: string
  userId: string
  spendFor: string
  revalueFor: string
  revalueType: 'INFINITE' | 'REVERT'
  revalueAmount: number
}

export type generalPostResType = {
  _id: string
  caption: string
  createdAt: Date
  place: string
  src: string
  ratio: string | number
}

export type generalPostWithUploaderResType = GeneralPost_

export type PostPopupState_ = {
  openGeneralPost: boolean
  openCategoryPost: boolean
  openValuationPost: boolean
  generalPost: generalPostWithUploaderResType
  categoryPost: CategoryPost_
  valuationPost: ValuationPost_
}

export type toastMessageStateType = {
  message: ReactNode | string
  duration: number
  show: boolean
}

export type SystemOptions_ = {
  zenMode: {
    isActive: boolean
    on: boolean
  }
  confirmPopups: {
    interesting: {
      noOfClicks: number
      show: boolean
    }
    follow: {
      noOfClicks: number
      show: boolean
    }
  }
  ambientBio: boolean
}

export type reducerActionType = {
  payload: any
  type: string
}

export type CategoriesPageState_ = {
  openSelectCategory: boolean
  currentCategory: string
}

export type BioState_ = {
  biosToShow: 'ALL' | 'OWNED'
}

export type Stats_ = 'PLAYER' | 'UPLOADER'
export type StatsboardState_ = {
  statsToShow: Stats_
}

export type BlockCoinsTab_ = 'claim' | 'blocked'
export type BlockCoinsPage_ = {
  tab: BlockCoinsTab_
}

export type FriendsLeaderboardType = 'friends'
export type GlobalLeaderboardType = 'global'
export type CountryLeaderboardType = 'country'
export type LeaderboardType_ = GlobalLeaderboardType | CountryLeaderboardType | FriendsLeaderboardType
export type LeaderboardState_ = {
  tab: LeaderboardType_
}

export type ExploreState_ = {
  post:
    | (ValuationPost_ & { postType: 'VALUATION' })
    | (GeneralPost_ & { postType: 'GENERAL' })
    | (CategoryPost_ & { postType: 'TOP10'; priority: number })
}

export type CoinStatsTab = 'OUTGOING' | 'INCOMING'

export type CoinWalletState = {
  paletteName: PaletteType
  palette: {
    bg: string[]
    text: string[]
  }
  stats: CoinStatsTab
  lastResetPinTime: Date | undefined
}

export type storeType = {
  profilePage: profilePageState
  appbar: appbarStateType
  navbar: navbarStateType
  addPostPopup: addPostPopupState
  postState: postStateType
  storyState: storyStateType
  postPopupState: PostPopupState_
  toastState: toastMessageStateType
  categoryPageState: CategoriesPageState_
  bioState: BioState_
  messagingState: MessagingState_
  systemOptions: SystemOptions_
  statsboardState: StatsboardState_
  blockCoins: BlockCoinsPage_
  explore: ExploreState_
  leaderboard: LeaderboardState_
  coinWallet: CoinWalletState
}

export type generalPostsResponseType = {
  currentPage: number
  pages: number
  posts: generalPostResType[]
}
export type savedPostsResponseType = {
  currentPage: number
  pages: number
  data: generalPostWithUploaderResType[]
}

export type generalPostsByUsernameResponseType = {
  currentPage: number
  pages: number
  posts: GeneralPost_[]
}

export type genPostCountsResponseType = {
  likesCount: number
  commentsCount: number
  tagsCount: number
  isLiked: boolean
  isSaved: boolean
}

export type fetchProfileResponseType = {
  location: {
    type: 'Point'
    coordinates: number[]
  }
  name: string
  email: string
  username: string
  profilePic: string
  gender: 'MALE' | 'FEMALE' | 'OTHERS'
  dateOfBirth: Date
  place: string
  country: string
  countryCode: string
  isPrivate: boolean
  isVerified: boolean
  stories: string[]
  pstories: string[]
  bio: {
    name: string
    src: string
  }
  _id: string
}

export type likedByType = {
  _id: string
  name: string
  username: string
  profilePic: string
}

export type viewLikesResponseType = {
  pages: number
  currentPage: number
  likedBy: likedByType[]
}

export type commenterType = {
  _id: string
  name: string
  username: string
  profilePic: string
}

export type commentType = {
  commenter: commenterType
  comment: string
  isLiked: boolean
  likesCount: number
  postedAt: Date
  commentId: string
}

export type viewCommentResponseType = {
  pages: number
  currentPage: number
  comments: commentType[]
}

export type categoriesType = {
  _id: string
  category: categoryType
  priority: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
}

export type categoriesListType = categoriesType[]

export type LeaderboardCardProps = {
  name: string
  country: string
  countryCode: string
  previousRank: number
  email: string
  profilePic: string
  rank: number
  username: string
  wallet: number
  _id: string
}

export type LeaderboardListResponse = PaginationResponse_ & {
  data: LeaderboardCardProps[]
}

export type SuccessCallback_ = (value?: AxiosResponse<any, any> | any) => void | PromiseLike<void>
export type ErrorCallback_ = (reason?: any) => PromiseLike<never> | void

export type Commentor_ = {
  _id: string
  name: string
  username: string
  profilePic: string
}

export type Comment_ = {
  commentId: string
  commenter: Commentor_
  comment: string
  isInterested: boolean
  interestedCount: number
  postedAt: Date
}

export type PostUploader_ = {
  _id: string
  username: string
  profilePic: string
}
export type PostUploaderWithName_ = {
  name: string
} & PostUploader_

export type MutationSuccessCallback_ = (response: AxiosResponse) => any
export type MutationErrorCallback_ = (error: AxiosError) => any

export type PaginationParams_ = {
  page: number
  size: number
}

export type PaginationResponse_ = {
  pages: number
  currentPage: number
}
