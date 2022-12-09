import http from '../../../config/http'
import type {
  AddCategoryPostParams_,
  FetchCategoryPostCounts_,
  FetchCategoryPostCountsParams_,
  FetchCategoryPostComments_ as FetchComments_,
  FetchCategoryPostCommentsParams_ as GetCommentsParams_,
  FetchPostsByCategoryParams_ as ByCategoryParams_,
  FetchPostsByCategory_ as ByCategory_,
  FetchSlotOnePostParams_ as GetSlotOneParams_,
  FetchSlotOnePost_ as GetSlotOne_,
  FetchCategoryPostInterestsParams_ as ViewInterestsParams_,
  FetchCategoryPostInterests_ as ViewInterests_,
  EditCategoryPostParams_ as EditPost_,
  DeleteCategoryPostParams_ as DeletePost_,
  CommentCategoryPostParams_,
  CommentCategoryPost_,
  FetchIsCategoryPostCommentInterested_,
  FetchIsCategoryPostCommentInterestedParams_,
  InterestCategoryPostCommentParams_,
  DeleteCategoryPostComment_ as DeleteComment_,
  AddCategoryPost_,
  CategoryPostWithUploaderCategories_
} from '../../../types/category-post.type'

const URL = {
  upload: '/user/category-post',
  counts: (postId: string) => `/user/category-post/counts/${postId}`,
  edit: (postId: string) => `/user/category-post/${postId}`,
  get: {
    slotOne: ({ username, categoryId }: GetSlotOneParams_) => {
      return `/user/category-post/slot-one/${username}/${categoryId}`
    },
    byCategory: ({ username, categoryId }: ByCategoryParams_) => {
      return `/user/category-post/${username}/${categoryId}`
    },
    byId: (postId: string) => `/user/category-post/${postId}`
  },
  interest: {
    add: (postId: string) => `/user/category-post/interest/${postId}`,
    view: (postId: string) => `/user/category-post/interests/view/${postId}`
  },
  comments: {
    add: (postId: string) => `/user/category-post/comment/${postId}`,
    view: (postId: string) => `/user/category-post/comments/view/${postId}`,
    delete: (commentId: string) => `/user/category-post/comment/${commentId}`,
    interest: (postId: string, commentId: string) => {
      return `/user/category-post/comment/interest/${postId}/${commentId}`
    },
    isInterested: (commentId: string) => `/user/category-post/comment/is-interested/${commentId}`
  }
}

const commentsQueries = {
  get: ({ postId, ...params }: GetCommentsParams_) => {
    return http.get<FetchComments_>(URL.comments.view(postId), { params })
  },
  post: ({ postId, comment }: CommentCategoryPostParams_) => {
    return http.post<CommentCategoryPost_>(URL.comments.add(postId), { comment })
  },
  delete: ({ commentId }: DeleteComment_) => http.delete(URL.comments.delete(commentId)),
  interest: ({ postId, commentId }: InterestCategoryPostCommentParams_) => {
    return http.post(URL.comments.interest(postId, commentId))
  },
  isInterested: ({ commentId }: FetchIsCategoryPostCommentInterestedParams_) => {
    return http.get<FetchIsCategoryPostCommentInterested_>(URL.comments.isInterested(commentId))
  }
}

const categoryPostQueries = {
  upload: (post: AddCategoryPostParams_) => {
    const formData = new FormData()

    const image = new File([post.image], 'image.png', {
      type: post.image.type
    })

    formData.append('category_slot', image)
    formData.append('url', post.url || '')
    formData.append('caption', post.caption || '')
    formData.append('title', post.title || '')
    formData.append('category', post.categoryId)
    formData.append('slot', post.slot.toString())
    formData.append('ratio', `${post.ratio}`)

    return http.post<AddCategoryPost_>(URL.upload, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  editPost: ({ postId, ...fields }: EditPost_) => http.put(URL.edit(postId), fields),
  deletePost: ({ postId }: DeletePost_) => http.delete(`/user/category-post/${postId}`),
  getCounts: ({ postId }: FetchCategoryPostCountsParams_) =>
    http.get<FetchCategoryPostCounts_>(URL.counts(postId)),
  interestPost: (postId: string) => http.post(URL.interest.add(postId)),
  viewInteresting: ({ postId, ...params }: ViewInterestsParams_) => {
    return http.get<ViewInterests_>(URL.interest.view(postId), { params })
  },
  get: {
    slotOnePost: (params: GetSlotOneParams_) => http.get<GetSlotOne_>(URL.get.slotOne(params)),
    byCategory: (params: ByCategoryParams_) => http.get<ByCategory_>(URL.get.byCategory(params)),
    byId: (postId: string) =>
      http.get<{ data: CategoryPostWithUploaderCategories_ }>(URL.get.byId(postId))
  },
  comments: commentsQueries
}

export default categoryPostQueries
