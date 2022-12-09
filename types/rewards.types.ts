export type GetDailyLoginRewardsResponse_ = {
  message?: string
  season: {
    base_reward: number
    createdAt: Date
    _id: string
    title: string
    description: string
    day: number
  }[]
  collection: {
    _id: string
    day: number
  }[]
}
