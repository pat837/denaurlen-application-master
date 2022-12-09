import { useInfiniteQuery } from 'react-query'

import { getNextPageParams } from '../../utils'
import queries from './transactions.routes'

export const claimCoinsKey = 'claim-coins'

const useFetchClaimedCoins = (size = 25) =>
  useInfiniteQuery(
    claimCoinsKey,
    ({ pageParam = 1 }) => queries.getClaimedCoins({ page: pageParam, size }),
    {
      select: response => ({
        pageParams: response.pageParams,
        pages: response.pages.map(page => page.data.data)
      }),
      getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
    }
  )

export default useFetchClaimedCoins
