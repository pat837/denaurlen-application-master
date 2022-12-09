import useGetIncomeStats from '../../api-routes/transactions/income-stats'
import coinsStatsFormat from '../../utils/coin-stats-formatter'

const useIncomeStats = () => {
  const { data, isLoading, isFetching, isError, refetch } = useGetIncomeStats()

  const formatted = data === undefined ? undefined : coinsStatsFormat.basicIncome(data)

  return {
    data: formatted,
    isLoading,
    isError,
    isFetching,
    refetch
  }
}

export default useIncomeStats
