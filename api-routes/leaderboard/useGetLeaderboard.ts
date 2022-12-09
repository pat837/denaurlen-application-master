import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query'

import { queryClient } from '../../config/query-client'
import storage from '../../config/storage'
import { getNextPageParams } from '../../utils'
import leaderboardQueries from './leaderboard.routes'

import type { LeaderboardCardProps } from '../../types'
type useGetLeaderboardReturnType = {
  pageParams: any[]
  pages: LeaderboardCardProps[]
}

export const globalLeaderboardKey = 'gMnBZWTbS0'

const useGetGlobalLeaderboard = (size = 50) => {
  const [key, store] = [globalLeaderboardKey, storage.session]

  let options: Omit<UseInfiniteQueryOptions<any, any, any, string>, 'queryKey' | 'queryFn'> = {
    //select
    select: (res: any): useGetLeaderboardReturnType => {
      store.add({ key, value: res })

      return {
        pageParams: res.pageParams,
        pages: res.pages.flatMap((page: { data: { data: any } }) => page.data.data)
      }
    },
    getNextPageParam: (lastPage: { data: { currentPage: number; pages: number } }) =>
      getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
  }

  const data = store.get(key)

  if (!!data) options = { ...options, initialData: data }

  return {
    ...useInfiniteQuery(
      key,
      ({ pageParam = 1 }) => leaderboardQueries.getLeaderboard({ page: pageParam, size }),
      options
    ),
    clearAndRefetchQuery: () => {
      queryClient.removeQueries(key)
      queryClient.resetQueries(key)
    }
  }
}

export default useGetGlobalLeaderboard
