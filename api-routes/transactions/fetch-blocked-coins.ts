import { useInfiniteQuery } from 'react-query'

import queries from './transactions.routes'
import { getNextPageParams } from '../../utils'

export const blockedCoinsKey = 'blocked-coins'

const useFetchBlockedCoins = (size = 20) =>
  useInfiniteQuery(
    blockedCoinsKey,
    ({ pageParam = 1 }) => queries.getBlockedCoins({ page: pageParam, size }),
    {
      getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages),
      select: response => ({
        pageParams: response.pageParams,
        pages: response.pages.map(page => page.data.data)
      })
    }
  )

export default useFetchBlockedCoins
