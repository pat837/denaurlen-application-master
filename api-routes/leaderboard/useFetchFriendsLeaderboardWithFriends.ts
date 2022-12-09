import { useInfiniteQuery } from 'react-query'

import { queryClient } from '../../config/query-client'
import { getNextPageParams } from '../../utils'
import leaderboardQueries from './leaderboard.routes'

import type { LeaderboardCardProps } from '../../types'
type useGetLeaderboardReturnType = {
  pageParams: any[]
  pages: LeaderboardCardProps[]
}

export const friendsLeaderboardKey = '3EYcPx1rS8'

const useGetFriendsLeaderboardWithSearch = (user: string, size = 20) => {
  const key = [friendsLeaderboardKey, user]

  return {
    ...useInfiniteQuery(
      key,
      ({ pageParam = 1 }) => leaderboardQueries.getFriendsLeaderboardWithSearch({ user, page: pageParam, size }),
      {
        select: (res: any): useGetLeaderboardReturnType => {
          return {
            pageParams: res.pageParams,
            pages: res.pages.flatMap((page: { data: { data: any } }) => page.data.data)
          }
        },
        getNextPageParam: (lastPage: { data: { currentPage: number; pages: number } }) =>
          getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
      }
    ),
    clearAndRefetchQuery: () => {
      queryClient.removeQueries(key)
      queryClient.resetQueries(key)
    }
  }
}

export default useGetFriendsLeaderboardWithSearch
