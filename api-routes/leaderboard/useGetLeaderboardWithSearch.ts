import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query'

import { queryClient } from '../../config/query-client'
import { getNextPageParams } from '../../utils'
import leaderboardQueries from './leaderboard.routes'
import { globalLeaderboardKey } from './useGetLeaderboard'

import type { LeaderboardCardProps } from '../../types'
type useGetLeaderboardReturnType = {
  pageParams: any[]
  pages: LeaderboardCardProps[]
}

const useGetGlobalLeaderboardWithSearch = (user: string, size = 50) => {
  const key = [globalLeaderboardKey, user]

  let options: Omit<UseInfiniteQueryOptions<any, any, any, string[]>, 'queryKey' | 'queryFn'> = {
    //select
    select: (res: any): useGetLeaderboardReturnType => {
      return {
        pageParams: res.pageParams,
        pages: res.pages.flatMap((page: { data: { data: any } }) => page.data.data)
      }
    },
    getNextPageParam: (lastPage: { data: { currentPage: number; pages: number } }) =>
      getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
  }

  return {
    ...useInfiniteQuery(
      key,
      ({ pageParam = 1 }) => leaderboardQueries.getLeaderboardWithSearch({ user, page: pageParam, size }),
      options
    ),
    clearAndRefetchQuery: () => {
      queryClient.removeQueries(key)
      queryClient.resetQueries(key)
    }
  }
}

export default useGetGlobalLeaderboardWithSearch
