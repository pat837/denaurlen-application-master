import http from '../../config/http'

import type {
  CountryLeaderboardType,
  FriendsLeaderboardType,
  GlobalLeaderboardType,
  LeaderboardListResponse,
  PaginationParams_
} from '../../types'

export type LeaderboardParams = PaginationParams_ & {
  signal?: AbortSignal
  search?: string
} & (
    | { type: GlobalLeaderboardType | FriendsLeaderboardType }
    | { type: CountryLeaderboardType; countryCode: string }
  )

type LeaderboardWithSearch_ = PaginationParams_ & { user: string }

const urls = {
  global: 'user/leaderboard',
  country: 'user/leaderboard-country',
  friends: 'user/-friends'
}

const getLeaderboard = ({ search = '', signal, page, size, ...rest }: LeaderboardParams) => {
  const url = `${urls[rest.type]}${
    rest.type === 'country' ? `/${rest.countryCode.toLowerCase()}` : ''
  }/${search}`

  return http.get<LeaderboardListResponse>(url, { params: { page, size }, signal })
}

const leaderboardRoutes = {
  getLeaderboard: (params: PaginationParams_) => http.get('/user/leaderboard', { params }),
  getFriendsLeaderboard: ({ page, size }: PaginationParams_) =>
    http({
      method: 'GET',
      url: '/user/leaderboard-friends',
      params: { page, size }
    }),
  getCountryLeaderboard: ({ page, size, countryCode }: PaginationParams_ & { countryCode: string }) =>
    http({
      method: 'GET',
      url: `/user/leaderboard-country/${countryCode.toLowerCase()}`,
      params: { page, size }
    }),
  getLeaderboardWithSearch: ({ page, size, user }: LeaderboardWithSearch_) =>
    http({
      method: 'GET',
      url: `/user/leaderboard/${user}`,
      params: { page, size }
    }),
  getFriendsLeaderboardWithSearch: ({ page, size, user }: LeaderboardWithSearch_) =>
    http({
      method: 'GET',
      url: `/user/leaderboard-friends/${user}`,
      params: { page, size }
    }),
  getCountryLeaderboardWithSearch: ({
    page,
    size,
    countryCode,
    user
  }: LeaderboardWithSearch_ & { countryCode: string }) =>
    http({
      method: 'GET',
      url: `/user/leaderboard-country/${countryCode.toLowerCase()}/${user}`,
      params: { page, size }
    }),
  fetchLeaderboard: getLeaderboard
}

export default leaderboardRoutes
