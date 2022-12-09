import http from '../../config/http'
import { PostUploader_ } from '../../types'

import type {
  ClaimCoinsParams_,
  FetchBlockedCoins_,
  FetchBlockedCoinsParams_,
  FetchCardDetails_,
  FetchClaimedCoins_,
  FetchClaimedCoinsParams_,
  FetchTransactions_,
  FetchTransactionsParams_,
  ShareCoinsTransaction_,
  IncomeAndOutgoingStatsResponse as StatsRes
} from '../../types/transactions.types'

export type TransactionsSummaryResponse_ = {
  debited: {
    amount: number
  }[]
  credited: {
    amount: number
  }[]
}

abstract class TransactionRoutes {
  private static readonly url = {
    transactionList: 'user/transactions',
    todaySummary: 'user/transactions/todays-amount',
    cardDetails: 'user/card',
    requestCard: 'user/card/otp',
    generateCard: 'user/card/generate',
    knowYourPin: 'user/card/pin/know-pin',
    updatePin: 'user/card/pin/update-pin',
    resetOTP: 'user/card/pin/reset-otp',
    resetPin: 'user/card/reset-pin',
    blockedCoins: 'user/blocked-coins',
    claimCoins: 'user/claim-coins',
    claimedCoins: 'user/claimed-coins',
    shareCoins: '/user/share-dens',
    todaysLimit: '/user/card/todays-limit',
    shareCoinsTransactions: '/user/card/transactions',
    incomeStats: 'user/wallet/income',
    outgoingStats: 'user/wallet/outcome',
    cardUser: (search: string) => `user/card/users/${search}`
  }

  static getTransactions = (params: FetchTransactionsParams_) => {
    return http.get<FetchTransactions_>(this.url.transactionList, { params })
  }

  static getTodaysSummary = () => http.get<TransactionsSummaryResponse_>(this.url.todaySummary)

  static getCardDetails = () => http.get<FetchCardDetails_>(this.url.cardDetails)

  static sendCardRequest = () => http.post(this.url.requestCard)

  static verifyOTPAndGenerateCard = (params: { otp: string }) => {
    return http.post<FetchCardDetails_>(this.url.generateCard, params)
  }

  static getBlockedCoins = (params: FetchBlockedCoinsParams_) => {
    return http.get<FetchBlockedCoins_>(this.url.blockedCoins, { params })
  }

  static claimCoins = (params: ClaimCoinsParams_) => http.post(this.url.claimCoins, params)

  static getClaimedCoins = (params: FetchClaimedCoinsParams_) => {
    return http.get<FetchClaimedCoins_>(this.url.claimCoins, { params })
  }

  static getTodaysLimit = () => http.get<{ limit: number }>(this.url.todaysLimit)

  static getCardUsers = (parameters: { page: number; size: number; search: string; signal?: AbortSignal }) => {
    const { search, signal, ...params } = parameters

    return http.get<{ pages: number; currentPage: number; data: (PostUploader_ & { name: string })[] }>(
      this.url.cardUser(search),
      { params, signal }
    )
  }

  static shareCoins = (params: { cr_account: string; dens: number; memo: string; inputPin: string }) => {
    return http.post(this.url.shareCoins, params)
  }

  static shareCoinsTransactions = (params: { page: number; size: number }) => {
    return http.get<{ pages: number; currentPage: number; data: ShareCoinsTransaction_[] }>(
      this.url.shareCoinsTransactions,
      { params }
    )
  }

  static incomeStats = () => http.get<StatsRes>(this.url.incomeStats)

  static outgoingStats = () => http.get<StatsRes>(this.url.outgoingStats)

  static getResetPinOTP = () => http.post(this.url.resetOTP)

  static resetPin = (params: { otp: string; pin: string }) => http.post(this.url.resetPin, params)

  static updatePin = (params: { oldPin: string; newPin: string }) => http.put(this.url.updatePin, params)

  static knowYourPin = (params: { password: string }) => {
    return http.post(this.url.knowYourPin, params)
  }
}

export default TransactionRoutes
