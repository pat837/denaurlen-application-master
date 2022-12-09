import http from '../../config/http'

import type { GetDailyLoginRewardsResponse_ } from '../../types/rewards.types'

const url = {
  isCollected: 'user/missions/daily-login/is-reward-collected',
  dailyRewards: 'user/missions/daily-login',
  collectReward: 'user/missions/daily-login/collect-reward'
}

const isCollected = () => http.get<{ isCollected: boolean }>(url.isCollected)

const dailyRewards = () => http.get<GetDailyLoginRewardsResponse_>(url.dailyRewards)

const collectReward = () => http.post(url.collectReward)

const rewardRoutes = { isCollected, dailyRewards, collectReward }

export default rewardRoutes
