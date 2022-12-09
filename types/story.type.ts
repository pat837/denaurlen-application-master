import { PostUploader_ } from '.'

export type GeneralStoryAddParams_ = {
  image: Blob
  caption: string
}

export type Story_ = {
  _id: string
  uploader: string
  src: string
  caption: string
  storyType: 'GENERAL' | 'PREMIUM'
  createdAt: Date
  updatedAt: Date
  postId: string
}
export type HomePageStory_ = Omit<Story_, 'uploader'> & { uploader: PostUploader_ }

export type FetchStoriesByUsernameParams_ = {
  username: string
}
export type FetchStoriesByUsername_ = Story_[]
// is view
export type FetchIsViewedStoryParams_ = {
  storyId: string
}
export type FetchIsViewedStory_ = {
  isViewed: boolean
}
// view
export type ViewStoryParams_ = {
  storyId: string
  storyType: 'GENERAL' | 'PREMIUM'
}

export type FetchGeneralStoryViewListParams_ = {
  storyId: string
  page: number
  size: number
}

export type FetchGeneralStoryViewList_ = {
  pages: number
  currentPage: number
  data: {
    _id: string
    storyId: string
    viewedBy: PostUploader_ & { name: string }
    createdAt: Date
  }[]
}

export type FetchGeneralStoryViewCountParams_ = {
  storyId: string
}
export type FetchGeneralStoryViewCount_ = {
  count: number
}
