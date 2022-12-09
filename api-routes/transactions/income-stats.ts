import { useQuery } from 'react-query'
import TransactionRoutes from './transactions.routes'

export const incomeStatsKey = 'coin-income-stats'

const useGetIncomeStats = () => {
  return useQuery(incomeStatsKey, TransactionRoutes.incomeStats, { select: res => res.data.data })
}

export default useGetIncomeStats
