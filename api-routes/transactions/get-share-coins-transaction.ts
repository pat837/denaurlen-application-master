import { useInfiniteQuery } from 'react-query'

import transactionQueries from './transactions.routes'

export const shareCoinsTransactions = 'share-coins-transactions'

const useGetShareCoinsTransaction = (size = 20) => {
  return useInfiniteQuery(
    shareCoinsTransactions,
    ({ pageParam = 1 }) => transactionQueries.shareCoinsTransactions({ page: pageParam, size }),
    {
      select: response => ({
        pageParams: response.pageParams,
        pages: response.pages.map(page => page.data.data)
      })
    }
  )
}

export default useGetShareCoinsTransaction
