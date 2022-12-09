import { useInfiniteQuery } from 'react-query'

import { getNextPageParams } from '../../utils'
import routes, { LeaderboardParams } from './leaderboard.routes'

import type { LeaderboardType_ } from '../../types'
type GetLeaderboardParams = {
  type: LeaderboardType_
  search?: string
  countryCode: string
}
type UseGetLeaderboard = Omit<LeaderboardParams, 'page' | 'signal'> & { countryCode: string }

export const getLeaderboard = ({ search = '', countryCode, type }: GetLeaderboardParams) => [
  'leaderboard',
  type,
  search,
  countryCode
]

const useGetLeaderboard = ({ search, size = 50, type, countryCode }: UseGetLeaderboard) =>
  useInfiniteQuery(
    getLeaderboard({ type: type, search, countryCode }),
    ({ pageParam = 1, signal }) =>
      routes.fetchLeaderboard({ search, signal, size, page: pageParam, type, countryCode }),
    {
      select: response => ({
        pageParams: response.pageParams,
        pages: response.pages.map(page => page.data.data)
      }),
      getNextPageParam: ({ data }) => getNextPageParams(data.currentPage, data.pages)
    }
  )

export default useGetLeaderboard
