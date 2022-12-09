import type { PaginationParams_ } from '.'
import type { ValuationPostStatus_ } from './valuation-post.type'

const transactionTypes = [
  'SIGNUP',
  'CATEGORIES',
  'BIO',
  'POST_GENERAL',
  'POST_TOP10',
  'POST_VALUATION',
  'PROFILE_PIC',
  'STORY',
  'FOLLOW',
  'INTERESTING',
  'LIKE',
  'COMMENT',
  'LIKE_COMMENT',
  'INTERESTING_COMMENT',
  'STORY_VIEW',
  'LEAD',
  'SPEND',
  'INFINITY',
  'REVERT',
  'CLAIM',
  'REWARD'
] as const

export type TransactionType_ = typeof transactionTypes[number]

export type AccountType_ = string | { _id: string; username: string }

export type Transaction_ = {
  _id: string
  transactionType: TransactionType_
  cr_Account: AccountType_
  amount: number
  status: 'SUCCESS' | 'IN_PROGRESS' | 'FAILED'
  error_message: string
  description: string
  createdAt: Date
  updatedAt: Date
  dr_Account: AccountType_
}

export type ShareCoinsTransaction_ = Transaction_ & {
  cr_Account: { _id: string; username: string }
  dr_Account: { _id: string; username: string }
}

export type FetchTransactionsParams_ = PaginationParams_

export type FetchTransactions_ = {
  pages: number
  currentPage: number
  data: Transaction_[]
}
//Get Card Details
export type FetchCardDetails_ = {
  isCardGenerated: boolean
  _id: string
  userId: string
  card_number: string
  limit: number
  expiry_date: Date
  cvv: number
  createdAt: Date
  updatedAt: Date
}

export type FetchBlockedCoinsParams_ = {
  page: number
  size: number
}

export type BlockCoins_ = {
  _id: string
  postId: {
    _id: string
    src: string[]
    status: ValuationPostStatus_
  }
  game: number
  spendCoins: number
}
export type FetchBlockedCoins_ = {
  pages: number
  currentPage: number
  data: BlockCoins_[]
}

export type ClaimCoinsParams_ = { trackId: string; postId: string }
export type FetchClaimedCoinsParams_ = FetchBlockedCoinsParams_
export type FetchClaimedCoins_ = {
  pages: number
  currentPage: number
  data: {
    _id: string
    postId: {
      _id: string
      src: string[]
      status: ValuationPostStatus_
      highestValuer: string
    }
    game: number
    spendCoins: number
  }[]
}

type GroupedBasicType = 'OTHERS' | 'LIKES' | 'UPLOADS'

export type GroupedOutgoingType = 'VALUATION' | GroupedBasicType

export type GroupedTransactionType = 'REWARDS' | 'VALUATION' | GroupedBasicType

export type StatsInRes = {
  type: TransactionType_
  percentage: number
}

export type FilteredStatsInRes = {
  type: GroupedTransactionType
  percentage: number
}

export type IncomeAndOutgoingStatsResponse = {
  data: StatsInRes[]
}

export type CoinStats = {
  [key in GroupedTransactionType]: number
}

export type OutgoingStats = {
  [key in GroupedOutgoingType]: number
}
