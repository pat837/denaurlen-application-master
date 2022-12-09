import useGetOutgoingStats from '../../api-routes/transactions/outgoing-stats'
import coinsStatsFormat from '../../utils/coin-stats-formatter'

const useOutgoingStats = () => {
  const { data, isLoading, isFetching, isError, refetch } = useGetOutgoingStats()

  return {
    data: data === undefined ? undefined : coinsStatsFormat.basicOutgoing(data),
    isLoading,
    isError,
    isFetching,
    refetch
  }
}

export default useOutgoingStats
