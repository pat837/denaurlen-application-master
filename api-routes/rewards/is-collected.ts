import { useQuery } from 'react-query'

import rewardRoutes from './rewards.routes'

export const isDailyLoginRewardCollectedKey = 'daily-login-rewards-collected'

const useIsDailyLoginRewardCollected = () =>
  useQuery(isDailyLoginRewardCollectedKey, rewardRoutes.isCollected, {
    select: response => response.data.isCollected,
    staleTime: 1000 * 60 * 30 // 👉 Thirty Minutes
  })

export default useIsDailyLoginRewardCollected
