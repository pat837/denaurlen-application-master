import { useQuery } from 'react-query'

import routes from './notifications.routes'

const REFETCH_INTERVAL = 1000 * 3 // 👉 THREE SECONDS

export const unreadNotificationCount = 'unread-notification-count'

const useFetchUnreadNotificationCount = (watch = false) =>
  useQuery(unreadNotificationCount, routes.unreadCount, {
    refetchInterval: (watch && REFETCH_INTERVAL) || undefined,
    select: response => response.data?.notifyCount || 0
  })

export default useFetchUnreadNotificationCount
