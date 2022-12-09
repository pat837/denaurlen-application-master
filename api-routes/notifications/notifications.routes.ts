import http from '../../config/http'
import {
  GetNotificationParams_,
  GetNotificationResponse_,
  GetUnreadNotificationCountResponse_ as CountsRes_
} from '../../types/notifications.types'

const routes = {
  get: '/user/notifications',
  unreadCount: '/user/notifications/unread-count',
  markAsRead: (notificationId: string) => `/user/notifications/${notificationId}`
}

const getActivities = (params: GetNotificationParams_) => {
  return http.get<GetNotificationResponse_>(routes.get, { params })
}

const getUnreadCount = ({ signal }: { signal?: AbortSignal }) =>
  http.get<CountsRes_>(routes.unreadCount, { signal })

const markAsRead = (notificationId: string, signal?: AbortSignal) =>
  http.post(routes.markAsRead(notificationId), {}, { signal })

const notificationsRoutes = {
  get: getActivities,
  unreadCount: getUnreadCount,
  markAsRead
}

export default notificationsRoutes
