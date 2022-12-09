import { useQuery } from 'react-query'

import transactionQueries from './transactions.routes'

export const todaysTransactionSummaryKey = 'jC6ayPlF0Q'

const useGetTodaysTransactionsSummary = () =>
  useQuery(todaysTransactionSummaryKey, transactionQueries.getTodaysSummary, {
    select: ({ data }) => ({
      credited: data.credited.length === 0 ? 0 : data.credited[0].amount,
      debited: data.debited.length === 0 ? 0 : data.debited[0].amount
    })
  })

export default useGetTodaysTransactionsSummary
