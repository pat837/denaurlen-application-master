import { useMutation } from 'react-query'

import { queryClient } from '../../config/query-client'
import useToastMessage from '../../hooks/toast-message.hook'
import { dailyRewardsKey } from './get-daily-rewards'
import { isDailyLoginRewardCollectedKey } from './is-collected'
import rewardRoutes from './rewards.routes'

const useCollectReward = () => {
  const showToast = useToastMessage()

  return useMutation(rewardRoutes.collectReward, {
    onError: (error: any, _variables, _context) => {
      showToast(error?.response?.data?.message || 'Something went wrong')
    },
    onSuccess: (data, _variables, _context) => {
      queryClient.invalidateQueries(dailyRewardsKey)
      queryClient.invalidateQueries(isDailyLoginRewardCollectedKey)

      showToast(data?.data?.message || "Collected today's reward")
    }
  })
}

export default useCollectReward
