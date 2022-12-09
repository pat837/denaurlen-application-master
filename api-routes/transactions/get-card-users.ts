import { useInfiniteQuery } from 'react-query'

import queries from './transactions.routes'
import { getNextPageParams } from '../../utils'

export const cardUsersKey = 'users-with-card'

const useFetchCardUser = (search = '', size = 30) =>
  useInfiniteQuery(
    [cardUsersKey, search],
    ({ pageParam = 1, signal }) => queries.getCardUsers({ page: pageParam, size, search, signal }),
    {
      select: response => ({
        pageParams: response.pageParams,
        pages: response.pages.map(page => page.data.data)
      }),
      getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
    }
  )

export default useFetchCardUser
