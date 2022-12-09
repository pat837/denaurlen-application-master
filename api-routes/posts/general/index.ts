import http from '../../../config/http'
import {
  AddGeneralPostParams_,
  AddGeneralPost_,
  DeleteGeneralPostParams_,
  EditGeneralPostParams_,
  FetchGeneralPostsParams_,
  FetchGeneralPosts_,
  FetchSavedPostsParams_,
  FetchSavedPosts_,
  FetchTaggedPostsParams_,
  FetchTaggedPosts_,
  LikeGeneralPostParams_,
  GetGeneralPostCountsParams_ as GetCountsParams_,
  GetGeneralPostCounts_ as GetCounts_,
  FetchGeneralPostComments_ as GetComments_,
  FetchGeneralPostCommentsParams_ as GetCommentsParams_,
  CommentOnGeneralPostRes_ as AddCommentRes_,
  CommentOnGeneralPost_ as AddComment_
} from '../../../types/general-post.types'

type EditComment_ = {
  postId: string
  commentId: string
  comment: string
}

export type IsLikedComment_ = {
  likesCount: number
  isLiked: boolean
}

type LikeComment_ = {
  postId: string
  commentId: string
}

const commentsQueries = {
  fetch: ({ postId, ...params }: GetCommentsParams_) =>
    http.get<GetComments_>(`/user/general-post/comments/view/${postId}`, { params }),
  add: ({ postId, comment }: AddComment_) =>
    http.post<AddCommentRes_>(`/user/general-post/comment/${postId}`, { comment }),
  edit: ({ postId, commentId, comment }: EditComment_) => {
    return http.put(`/user/general-post/edit-comment/${postId}/${commentId}`, { comment })
  },
  delete: (commentId: string) => {
    return http.delete(`/user/general-post/comment/${commentId}`)
  },
  isLiked: (commentId: string) =>
    http.get<IsLikedComment_>(`/user/general-post/comment/is-liked/${commentId}`),
  like: ({ postId, commentId }: LikeComment_) =>
    http.post(`/user/general-post/comment/like/${postId}/${commentId}`)
}

const postQueries = {
  getPosts: ({ username, ...params }: FetchGeneralPostsParams_) => {
    return http.get<FetchGeneralPosts_>(`/user/general-post/${username}`, { params })
  },
  getSavedPost: (params: FetchSavedPostsParams_) => {
    return http.get<FetchSavedPosts_>('/user/general-post/save/post', { params })
  },
  getTaggedPost: (params: FetchTaggedPostsParams_) => {
    return http.get<FetchTaggedPosts_>('/user/general-post/tags/posts', { params })
  },
  add: (post: AddGeneralPostParams_) => {
    const formData = new FormData()

    post.images.forEach(image => formData.append('general', image))

    formData.append('place', post.place)
    formData.append('caption', post.caption)
    formData.append('tags', JSON.stringify(post.tags))
    formData.append('ratio', post.ratio.toString())
    formData.append('hashTags', JSON.stringify(post.hashTags))
    formData.append('isVideo', post.isVideo ? '1' : '0')
    formData.append('location', JSON.stringify(post.location))

    return http.post<AddGeneralPost_>('/user/general-post/', formData, {
      headers: { 'Content-Type': 'multipart/form-data', setTimeout: 2 * 60 * 1000 },
      onUploadProgress: data => post.setProgress(Math.round((data.loaded / data.total) * 100))
    })
  },
  edit: ({ postId, ...fields }: EditGeneralPostParams_) => {
    return http.put(`/user/general-post/${postId}`, fields)
  },
  delete: ({ postId }: DeleteGeneralPostParams_) => http.delete(`/user/general-post/${postId}`),
  //others
  like: ({ postId }: LikeGeneralPostParams_) => http.post(`/user/general-post/like/${postId}`),
  save: (id: string) => http.post(`/user/general-post/save/post/${id}`),
  getCounts: ({ postId }: GetCountsParams_) =>
    http.get<GetCounts_>(`/user/general-post/counts/${postId}`),
  getTags: (params: { postId: string; page: number; size: number }) => {
    const { postId, page, size } = params

    return http({
      method: 'GET',
      url: `/user/general-post/tags/view/${postId}`,
      params: { page, size }
    })
  }
}

const generalPostQueries = { ...postQueries, comments: commentsQueries }

export default generalPostQueries
