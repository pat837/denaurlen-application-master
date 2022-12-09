import { useQuery } from 'react-query'
import TransactionRoutes from './transactions.routes'

export const outgoingStatsKey = 'coin-outgoing-stats'

const useGetOutgoingStats = () => {
  return useQuery(outgoingStatsKey, TransactionRoutes.outgoingStats, { select: res => res.data.data })
}

export default useGetOutgoingStats
