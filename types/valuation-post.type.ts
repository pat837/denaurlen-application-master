import { PostUploader_ } from '.'

export type ValuationPostStatus_ = 'PRE-BUZZ' | 'BUZZ' | 'ACTIVE' | 'VALUED' | 'DECLARED' | 'HOLD'

export type ValuationPost_ = {
  _id: string
  uploader: PostUploader_
  src: string[]
  caption: string
  place: string
  ratio: string | number
  postKeeper: PostUploader_
  baseValue: number
  status: ValuationPostStatus_
  createdAt: Date
  highestValuer: string
  netWorth: number
}

export type ValuationPostWithHighestValuer_ = {
  highestValuer: PostUploader_
} & Omit<ValuationPost_, 'highestValuer'>

export type FetchViewList_ = {
  pages: number
  currentPage: number
  data: {
    name: string
    username: string
    profilePic: string
    isAgreed: boolean
    viewedAt: Date
  }[]
}
export type FetchViewListParams_ = {
  page: number
  size: number
  postId: string
}
