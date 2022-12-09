import { useInfiniteQuery } from 'react-query'

import { getNextPageParams } from '../../utils'
import queries from './transactions.routes'

const useGetTransactions = (size = 25) =>
  useInfiniteQuery(
    'RGAzBeX8W9',
    ({ pageParam = 1 }) => queries.getTransactions({ page: pageParam, size }),
    {
      select: response => ({
        pageParams: response.pageParams,
        pages: response.pages.map(page => page.data.data)
      }),
      getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
    }
  )

export default useGetTransactions
