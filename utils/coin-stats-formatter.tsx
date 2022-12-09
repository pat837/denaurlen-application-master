import type {
  CoinStats,
  FilteredStatsInRes,
  GroupedOutgoingType,
  OutgoingStats,
  StatsInRes
} from '../types/transactions.types'

const basicIncomeFormat = (stats: StatsInRes[]) =>
  stats
    .map((t): FilteredStatsInRes => {
      switch (t.type) {
        case 'SIGNUP':
        case 'CATEGORIES':
        case 'STORY_VIEW':
        case 'REWARD':
          return { type: 'REWARDS', percentage: t.percentage }

        case 'LIKE':
        case 'LIKE_COMMENT':
        case 'INTERESTING':
        case 'INTERESTING_COMMENT':
          return { type: 'LIKES', percentage: t.percentage }

        case 'POST_GENERAL':
        case 'POST_TOP10':
        case 'STORY':
        case 'PROFILE_PIC':
          return { type: 'UPLOADS', percentage: t.percentage }

        case 'POST_VALUATION':
        case 'INFINITY':
        case 'REVERT':
        case 'REWARD':
        case 'SPEND':
        case 'CLAIM':
        case 'LEAD':
          return { type: 'VALUATION', percentage: t.percentage }

        default:
          return { type: 'OTHERS', percentage: t.percentage }
      }
    })
    .reduce((group, t) => {
      group[t.type] = (group[t.type] ?? 0) + t.percentage
      return group
    }, {} as CoinStats)

const basicOutgoingFormat = (stats: StatsInRes[]) =>
  stats
    .map((t): { type: GroupedOutgoingType; percentage: number } => {
      switch (t.type) {
        case 'LIKE':
        case 'LIKE_COMMENT':
        case 'INTERESTING':
        case 'INTERESTING_COMMENT':
          return { type: 'LIKES', percentage: t.percentage }

        case 'POST_GENERAL':
        case 'POST_TOP10':
        case 'STORY':
        case 'PROFILE_PIC':
          return { type: 'UPLOADS', percentage: t.percentage }

        case 'POST_VALUATION':
        case 'INFINITY':
        case 'REVERT':
        case 'REWARD':
        case 'SPEND':
        case 'CLAIM':
        case 'LEAD':
          return { type: 'VALUATION', percentage: t.percentage }

        default:
          return { type: 'OTHERS', percentage: t.percentage }
      }
    })
    .reduce((group, t) => {
      group[t.type] = (group[t.type] ?? 0) + t.percentage
      return group
    }, {} as OutgoingStats)

const coinsStatsFormat = { basicIncome: basicIncomeFormat, basicOutgoing: basicOutgoingFormat }

export default coinsStatsFormat
