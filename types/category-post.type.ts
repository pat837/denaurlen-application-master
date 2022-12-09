import { PostUploader_ } from '.'

export type Category_ = {
  _id: string
  src: string
  name: string
}

export type CategoryPost_ = {
  uploader: PostUploader_
  src: string[]
  category: Category_
  slot: number
  caption: string
  ratio: number | string
  title: string
  url: string
  createdAt: Date
  _id: string
}

export type CategoryPostWithUploaderCategories_ = Omit<CategoryPost_, 'uploader'> & {
  uploader: PostUploader_ & {
    categories: {
      category: string
      priority: number
      _id: string
    }[]
  }
}

export type CategoryPostComment_ = {
  commentId: string
  commenter: PostUploader_ & {
    name: string
  }
  comment: string
  postedAt: Date
}

// API

// ADD
export type AddCategoryPostParams_ = {
  image: Blob
  title: string
  url: string
  caption: string
  slot: number
  ratio: number
  categoryId: string
  hashTags: string[]
}
export type AddCategoryPost_ = CategoryPost_

// edit
export type EditCategoryPostParams_ = {
  postId: string
  caption?: string
  url?: string
  title?: string
}

// delete
export type DeleteCategoryPostParams_ = {
  postId: string
}

// Get Post By Category
export type FetchPostsByCategoryParams_ = {
  username: string
  categoryId: string
}
export type FetchPostsByCategory_ = CategoryPost_[]

// Get Slot One
export type FetchSlotOnePostParams_ = {
  username: string
  categoryId: string
}
export type FetchSlotOnePost_ = {
  category: string
  src: string[]
}[]

// post counts
export type FetchCategoryPostCountsParams_ = {
  postId: string
}
export type FetchCategoryPostCounts_ = {
  interestsCount: number
  commentsCount: number
  isInterested: boolean
}

//interesting

//fetch
export type FetchCategoryPostInterestsParams_ = {
  postId: string
  page: number
  size: number
}
export type FetchCategoryPostInterests_ = {
  pages: number
  currentPage: number
  data: (PostUploader_ & { name: string })[]
}

// comments
// add comment

export type CommentCategoryPostParams_ = {
  postId: string
  comment: string
}
export type CommentCategoryPost_ = {
  postId: string
  commenter: string
  comment: string
  postType: 'TOP10'
  _id: string
  createdAt: Date
  updatedAt: Date
}

// fetch
export type FetchCategoryPostCommentsParams_ = {
  postId: string
  page: number
  size: number
}
export type FetchCategoryPostComments_ = {
  pages: number
  currentPage: number
  comments: CategoryPostComment_[]
}

// is-interested
export type FetchIsCategoryPostCommentInterestedParams_ = {
  commentId: string
}
export type FetchIsCategoryPostCommentInterested_ = {
  interestsCount: number
  isInterested: boolean
}
// interest comment
export type InterestCategoryPostCommentParams_ = {
  postId: string
  commentId: string
}
// delete comment
export type DeleteCategoryPostComment_ = {
  commentId: string
}

export type CategorySwapCard_ = {
  _id: string
  userId: string
  cardType: 'TOP10SWAP'
  cardCount: number
  createdAt: Date
  updatedAt: Date
}
