import { AxiosResponse } from 'axios'
import http from '../../../config/http'
import {
  FetchGeneralStoryViewCountParams_,
  FetchGeneralStoryViewCount_,
  FetchGeneralStoryViewListParams_,
  FetchGeneralStoryViewList_,
  FetchIsViewedStoryParams_,
  FetchIsViewedStory_,
  FetchStoriesByUsernameParams_ as GetStoriesParams_,
  FetchStoriesByUsername_ as GetStories_,
  GeneralStoryAddParams_,
  ViewStoryParams_
} from '../../../types/story.type'
import profileService from '../../Profile'

type SuccessCallback_ =
  | ((value: AxiosResponse<any, any>) => void | PromiseLike<void>)
  | null
  | undefined
type ErrorCallback_ = ((reason: any) => PromiseLike<never> | void) | null | undefined

type GeneralStoryDelete_ = {
  storyId: string
  onSuccess: SuccessCallback_
  onError: ErrorCallback_
}

const urls = {
  getByUsername: (username: string) => `/user/stories/${username}`,
  isViewed: (storyId: string) => `/user/story/is-viewed/${storyId}`
}

const general = {
  delete: (params: GeneralStoryDelete_) => {
    const { storyId, onError, onSuccess } = params

    http.delete(`/user/general-story/${storyId}`).then(onSuccess).catch(onError)
  },
  add: (post: GeneralStoryAddParams_) => {
    const formData = new FormData()

    const image = new File([post.image], 'image.png', {
      type: post.image.type
    })

    formData.append('story', image)
    formData.append('caption', post.caption)

    return http.post('/user/general-story', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  view: (storyId: string) => http.post(`/user/general-story/view/${storyId}`),
  getViews: ({ storyId, ...params }: FetchGeneralStoryViewListParams_) => {
    return http.get<FetchGeneralStoryViewList_>(`/user/general-story/view-list/${storyId}`, {
      params
    })
  },
  getCounts: ({ storyId }: FetchGeneralStoryViewCountParams_) => {
    return http.get<FetchGeneralStoryViewCount_>(`/user/general-story/view/count/${storyId}`)
  }
}

const premium = {
  get: (username: string) => http.get(`/user/premium-story/${username}`),
  spendCoins: (storyId: string) => http.post(`/user/premium-story/spend/${storyId}`),
  agree: (storyId: string) => http.post(`/user/premium-story/agree/${storyId}`),
  followAndAgree: ({ storyId, userId }: { storyId: string; userId: string }) =>
    profileService.follow(userId).then(() => http.post(`/user/premium-story/agree/${storyId}`)),
  view: (storyId: string) => http.post(`/user/premium-story/view/${storyId}`),
  getViews: ({ storyId, page, size }: { storyId: string; page: number; size: number }) =>
    http({
      method: 'GET',
      url: `/user/premium-story/view-list/${storyId}`,
      params: { page: page || 1, size }
    })
}

const storyQueries = {
  getByUsername: ({ username }: GetStoriesParams_) =>
    http.get<GetStories_>(urls.getByUsername(username)),
  isViewed: ({ storyId }: FetchIsViewedStoryParams_) =>
    http.get<FetchIsViewedStory_>(urls.isViewed(storyId)),
  isStoriesViewed: (storyIdList: string[]) =>
    Promise.all(storyIdList.map((id) => http.get<FetchIsViewedStory_>(urls.isViewed(id)))),
  view: ({ storyId, storyType }: ViewStoryParams_) =>
    storyType === 'GENERAL' ? general.view(storyId) : premium.view(storyId),
  general,
  premium
}

export default storyQueries
