import http from '../../../config/http'
import type {
  FetchViewListParams_,
  FetchViewList_,
  ValuationPostWithHighestValuer_,
  ValuationPost_
} from '../../../types/valuation-post.type'

type UploadValuationPost_ = {
  image: Blob
  caption?: string
  place?: string
  baseValue: number
  viewValue: number
  aspectRatio: number
}

type EditPost_ = {
  caption?: string
  place?: string
}

type View_ = {
  postId: string
  page: number
  size: number
}

const valuationPostQueries = {
  upload: ({ image, caption, place, baseValue, viewValue, aspectRatio }: UploadValuationPost_) => {
    const formData = new FormData()

    const file = new File([image], 'image.jpeg', {
      type: image.type
    })

    formData.append('valuation', file)
    formData.append('caption', caption || '')
    formData.append('place', place || '')
    formData.append('baseValue', `${baseValue}`)
    formData.append('viewWorth', `${viewValue}`)
    formData.append('ratio', `${aspectRatio}`)

    return http.post('/user/valuation-post', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  edit: (postId: string, fields: EditPost_) => http.put(`/user/valuation-post/${postId}`, fields),
  get: (params: { username: string; page: number; size: number }) => {
    const { username, page, size } = params

    return http({
      method: 'GET',
      url: `/user/valuation-post/valuation-posts/${username}`,
      params: { page, size }
    })
  },
  getValuedPost: (params: { username: string; page: number; size: number }) => {
    const { username, page, size } = params

    return http({
      method: 'GET',
      url: `/user/valuation-post/valued-posts/${username}`,
      params: { page, size }
    })
  },
  getPosts: {
    valuation: {
      ongoing: ({ username, isOthers }: { username: string; isOthers: boolean }) => {
        return http.get<{
          posts: ValuationPostWithHighestValuer_[]
          views: {
            postId: string
            viewedBy: string
            isAgreed: boolean
          }[][]
        }>(`/user/valuation-post/valuation/on-going/${username}`, {
          params: { isOthers }
        })
      },
      followingOngoing: (params: { page: number; size: number }) => {
        return http.get<{
          posts: ValuationPostWithHighestValuer_[]
          views: {
            postId: string
            viewedBy: string
            isAgreed: boolean
          }[][]
          message?: string
          pages: number
          currentPage: number
        }>('/user/valuation-post/others/on-going', { params })
      },
      declared: (props: { username: string; page: number; size: number }) => {
        const { username, ...params } = props

        return http.get<{
          posts: ValuationPostWithHighestValuer_[]
          currentPage: number
          pages: number
        }>(`/user/valuation-post/valuation/declared/${username}`, { params })
      },
      hold: () => {
        return http.get<{ posts: ValuationPost_[] }>(`/user/valuation-post/holded-posts`)
      }
    },
    valued: {
      ongoing: (props: { username: string; page: number; size: number }) => {
        const { username, ...params } = props

        return http.get<{
          posts: ValuationPostWithHighestValuer_[]
          views: {
            postId: string
            viewedBy: string
            isAgreed: boolean
          }[][]
        }>(`/user/valuation-post/valued/on-going/${username}`, { params })
      },
      declared: (props: { username: string; page: number; size: number }) => {
        const { username, ...params } = props

        return http.get<{
          posts: ValuationPostWithHighestValuer_[]
          currentPage: number
          pages: number
        }>(`/user/valuation-post/valued/declared/${username}`, { params })
      }
    }
  },
  getById: (id: string) => http.get<{ data: ValuationPost_ }>(`/user/valuation-post/post/${id}`),
  lead: {
    set: (postId: string) => http.post(`/user/valuation-post/lead/${postId}`),
    get: (postId: string) => http.get(`/user/valuation-post/status/${postId}`)
  },
  getCounts: (postId: string) => http.get(`/user/valuation-post/counts/${postId}`),
  interestPost: (postId: string) => http.post(`/user/valuation-post/interest/${postId}`),
  getInterests: ({ postId, ...params }: View_) => {
    return http({
      method: 'GET',
      url: `/user/valuation-post/interests/view/${postId}`,
      params
    })
  },
  viewPost: (postId: string) => http.post(`/user/valuation-post/view/${postId}`),
  agreeToPlay: (postId: string) => http.post(`/user/valuation-post/agree/${postId}`),
  getViewCounts: (postId: string) =>
    http.get<{ viewsCount: number; agreedCount: number }>(`/user/valuation-post/view/counts/${postId}`),
  viewList: ({ postId, ...params }: FetchViewListParams_) =>
    http.get<FetchViewList_>(`/user/valuation-post/view-list/${postId}`, { params }),
  infinite: ({ postId }: { postId: string }) => http.post(`/user/valuation-post/infinity/${postId}`),
  revert: ({ postId }: { postId: string }) => http.post(`/user/valuation-post/revert/${postId}`),
  comment: {
    add: ({ postId, comment }: { postId: string; comment: string }) => {
      return http.post(`/user/valuation-post/comment/${postId}`, { comment })
    },
    delete: ({ commentId }: { commentId: string; postId: string }) => {
      return http.delete(`/user/valuation-post/comment/${commentId}`)
    },
    interest: ({ postId, commentId }: { postId: string; commentId: string }) => {
      return http.post(`/user/valuation-post/comment/interest/${postId}/${commentId}`)
    },
    get: ({ postId, page, size }: View_) => {
      return http({
        method: 'GET',
        url: `/user/valuation-post/comments/view/${postId}`,
        params: { page, size }
      })
    },
    isCommentInterested: ({ commentId }: { commentId: string }) => {
      return http.get(`/user/valuation-post/comment/is-interested/${commentId}`)
    }
  },
  isValuationUnlocked: () => {
    return http.get<
      | { data: true }
      | {
          data: false
          followings: boolean
          followers: boolean
          top10Posts: boolean
          generalPosts: boolean
          counts: {
            followings: number
            followers: number
            top10Posts: number
            generalPosts: number
          }
        }
    >('/user/missions/valuation-unlock')
  },
  unlockValuation: () => http.post('/user/missions/valuation-unlock')
}

export default valuationPostQueries
