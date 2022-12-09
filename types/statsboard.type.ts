export type UploaderStatsResponse_ = {
  registrations: {
    highestRegistrations: number
    avgRegistrations: number
    totalRegistrations: number
  }
  views: {
    highestViews: number
    avgViews: number
    totalViews: number
  }
  interestingCount: number
  totalValuationPosts: number
  postCoins: {
    highestGrossWorth: number
    totalGrossWorth: number
    highestNetWorth: number
    totalNetWorth: number
    avgGrossWorth: number
    avgNetWorth: number
  }
  infinityCount: number
  gamers: {
    highestGamers: number
    avgGamers: number
    totalGamers: number
  }
  spectators: {
    highestSpectators: number
    avgSpectators: number
    totalSpectators: number
  }
  registrationsRatio: number
}

export type PlayerStatsResponse_ = {
  leadData: {
    totalLeadClicks: number
    avgLeadClicks: number
    highestLeadClicks: number
  }
  spentData: {
    totalSpentCoins: number
    avgSpentCoins: number
    highestSpentCoins: number
  }
  gamesPlayed: number
  gamesWon: number
  gamesRegistered: number
  winRatio: null | number
  infinityCount: number
}
