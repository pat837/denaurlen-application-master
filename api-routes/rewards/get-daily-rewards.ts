import { useQuery } from 'react-query'

import rewardRoutes from './rewards.routes'

export const dailyRewardsKey = 'daily-login-rewards'

const useGetDailyRewards = () =>
  useQuery(dailyRewardsKey, rewardRoutes.dailyRewards, {
    select: ({ data }) => {
      if (data?.message) return { collectionList: [], today: 0, baseReward: 0, data: new Date(), info: '' }

      return {
        collectionList: Array.from(Array(7).keys()).map(indx => ({
          day: indx,
          isCollected: data.collection.some(({ day }) => day === indx)
        })),
        today: data.season?.[0]?.day || 0,
        baseReward: data.season[0].base_reward,
        date: data.season[0].createdAt,
        info: data.season[0].description
      }
    },
    staleTime: 1000 * 60 * 30 // 👉 Thirty Minutes
  })

export default useGetDailyRewards
