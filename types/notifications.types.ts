import { PostUploader_ } from '.'

const notificationTypes = [
  'POST_LIKE',
  'POST_COMMENT',
  'POST_INTEREST',
  'FOLLOW',
  'UPLOADS',
  'TAG',
  'LEADERBOARD',
  'BENCHMARK',
  'INFINITE',
  'REVERT',
  'MENTION'
] as const

export type NotificationType_ = typeof notificationTypes[number]

export type ResponseNotification_ = {
  _id: string
  from_user: PostUploader_[]
  notificationType: NotificationType_
  post: {
    _id: string
    src: string[]
    postType: 'GENERAL' | 'VALUATION' | 'CATEGORY'
    thumbnail?: string
  }[]
  to_user: string
  __v: 0
  createdAt: Date
  description: string
  isDenaurlen: boolean
  updatedAt: Date
  views: any[]
}
export type Notification_ = {
  _id: string
  from_user: PostUploader_
  notificationType: NotificationType_
  post?: {
    _id: string
    src: string[]
    postType: 'GENERAL' | 'VALUATION' | 'CATEGORY'
    thumbnail?: string
  }
  to_user: string
  __v: 0
  createdAt: Date
  description: string
  isDenaurlen: boolean
  updatedAt: Date
  views: any[]
  isNew: boolean
}
export type GetNotificationParams_ = {
  page: number
  size: number
}
export type GetNotificationResponse_ = {
  pages: number
  currentPage: number
  data: ResponseNotification_[]
}

export type GetUnreadNotificationCountResponse_ = {
  notifyCount: number
}
