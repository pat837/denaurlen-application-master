import { useQuery } from 'react-query'

import transactionQueries from './transactions.routes'

export const todaysLimitKey = `kFd7Hf2wl90`

const useGetTodaysLimit = () =>
  useQuery(todaysLimitKey, transactionQueries.getTodaysLimit, {
    select: response => response.data.limit
  })

export default useGetTodaysLimit
