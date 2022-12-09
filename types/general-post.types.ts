import { PostUploader_ } from '.'

// ===> API CALLS

// Get Posts
export type FetchGeneralPostsParams_ = {
  username: string
  page: number
  size: number
}
export type FetchGeneralPosts_ = {
  page: number
  currentPage: number
  posts: GeneralPost_[]
}

// saved post
export type FetchSavedPostsParams_ = { size: number; page: number }
export type FetchSavedPosts_ = {
  page: number
  currentPage: number
  data: GeneralPost_[]
}

// saved post
export type FetchTaggedPostsParams_ = { size: number; page: number }
export type FetchTaggedPosts_ = {
  page: number
  currentPage: number
  data: GeneralPost_[]
}

// add post
export type AddGeneralPostParams_ = {
  images: File[]
  caption: string
  place: string
  location: number[]
  tags: string[]
  ratio: number
  hashTags: string[]
  isVideo: boolean
  setProgress: (n: number) => void
}
export type AddGeneralPost_ = Omit<GeneralPost_, 'uploader'> & { uploader: string }

// Edit Post
export type EditGeneralPostParams_ = {
  postId: string
  tags?: string[]
  caption: string
  place?: string
  hashTags?: string[]
}

// Delete Post
export type DeleteGeneralPostParams_ = {
  postId: string
}

// Like Post
export type LikeGeneralPostParams_ = {
  postId: string
}

// Get Counts
export type GetGeneralPostCountsParams_ = {
  postId: string
}
export type GetGeneralPostCounts_ = {
  likesCount: number
  commentsCount: number
  tagsCount: number
  isLiked: boolean
  isSaved: boolean
}

// comment
// get
export type FetchGeneralPostCommentsParams_ = {
  postId: string
  page: number
  size: number
}
export type FetchGeneralPostComments_ = {
  pages: number
  currentPage: number
  comments: {
    commentId: string
    commenter: PostUploader_ & { name: string }
    comment: string
    postedAt: Date
  }[]
}
export type CategoryPostComment_ = {
  commentId: string
  commenter: PostUploader_ & {
    name: string
  }
  comment: string
  postedAt: Date
}
export type CommentOnGeneralPost_ = {
  postId: string
  comment: string
}
export type CommentOnGeneralPostRes_ = {
  postId: string
  commenter: string
  comment: string
  postType: 'GENERAL'
  _id: string
  createdAt: Date
  updatedAt: Date
}

export type GeneralPost_ = {
  _id: string
  uploader: PostUploader_
  src: string[]
  caption: string
  place: string
  ratio: number
  createdAt: Date
  updatedAt: Date
} & ({ isVideo: false } | { isVideo: true; thumbnail: string })
