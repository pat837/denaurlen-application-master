import http from '../../../config/http'
import { PostUploaderWithName_ } from '../../../types'

export type postType_ = 'general' | 'category' | 'valuation'
type FetchPostLikesParams_ = {
  type: postType_
  postId: string
  page: number
  size: number
}
type FetchPostLikesResponse_ =
  | {
      currentPage: number
      page: number
      likedBy: PostUploaderWithName_[]
      data?: never
    }
  | {
      currentPage: number
      page: number
      data: PostUploaderWithName_[]
      likedBy?: never
    }

const routes = {
  get: {
    general: (postId: string) => `/user/general-post/likes/view/${postId}`,
    category: (postId: string) => `/user/category-post/interests/view/${postId}`,
    valuation: (postId: string) => `/user/valuation-post/interests/view/${postId}`
  }
}

const fetchPostLikes = ({ type, postId, ...params }: FetchPostLikesParams_) => {
  return http.get<FetchPostLikesResponse_>(routes.get[type](postId), { params })
}

const postLikeRoutes = {
  getLikes: fetchPostLikes
}

export default postLikeRoutes
