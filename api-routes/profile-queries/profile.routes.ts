import http from '../../config/http'
import { categoryType } from '../../types'
import { FetchSuggestionsParams_, FetchSuggestions_, Profile_ } from '../../types/profile.type'

type GetCommunity_ = {
  username: string
  page: number
  size: number
}

type UnselectedCategoriesParams_ = {
  page: number
  size: number
}

type UnselectedCategories_ = {
  pages: number
  currentPage: number
  data: categoryType[]
}

type SwapCard_ = {
  _id: string
  userId: string
  cardType: 'TOP10SWAP'
  cardCount: number
  createdAt: Date
  updatedAt: Date
}

type EditProfile_ = Omit<
  Profile_,
  'email' | 'profilePic' | 'bio' | '_id' | 'isVerified' | 'referralCode' | 'isPrivate' | 'authType'
>
type EditProfileResponse_ = Omit<Profile_, 'bio'>

const url = {
  profile: {
    get: (username: string) => `user/profile/${username}`,
    edit: 'user/profile'
  }
}

const profileQueries = {
  profile: {
    get: (username: string) => http.get<Profile_>(`/user/profile/${username}`),
    edit: (user: EditProfile_) => http.post<EditProfileResponse_>('/user/profile', user)
  },
  communityCounts: (username: string) => {
    return http.get<{
      myCommunityCount: number
      communityCount: number
    }>(`/user/community-count/${username}`)
  },
  community: ({ username, page, size }: GetCommunity_) =>
    http({
      method: 'GET',
      url: `/user/community/${username}`,
      params: { page, size }
    }),
  myCommunity: ({ username, page, size }: GetCommunity_) =>
    http({
      method: 'GET',
      url: `/user/my-community/${username}`,
      params: { page, size }
    }),
  suggestions: (params: FetchSuggestionsParams_) =>
    http.get<FetchSuggestions_>('/user/friends-suggestions', { params }),
  unselectedCategories: (params: UnselectedCategoriesParams_) => {
    return http.get<UnselectedCategories_>('/user/categories-all', { params })
  },
  getSwapCards: () => http.get<{ cards: SwapCard_ }>('/user/swap-card'),
  swapCategory: ({
    cardId,
    currentCategory,
    newCategory,
    categories
  }: {
    cardId: string
    newCategory: string
    currentCategory: string
    categories: {
      category: string
      priority: number
    }[]
  }) =>
    http.post(`/user/swap-category/${cardId}`, {
      newCategory,
      activeCategory: currentCategory,
      categories
    })
}

export default profileQueries
