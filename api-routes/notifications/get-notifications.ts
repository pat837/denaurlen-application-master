import { InfiniteData, useInfiniteQuery } from 'react-query'

import { getNextPageParams } from '../../utils'
import { Notification_ } from '../../types/notifications.types'
import routes from './notifications.routes'

export const notificationsKey = 'notifications'

const useFetchNotifications = (size = 20) =>
  useInfiniteQuery(notificationsKey, ({ pageParam = 1 }) => routes.get({ page: pageParam, size }), {
    select: (response): InfiniteData<Notification_[]> => ({
      pageParams: [],
      pages: response.pages.map(page =>
        page.data.data.map(notification => ({
          ...notification,
          isNew: notification.views.length === 0,
          post: notification.post[0] || undefined,
          from_user: notification.from_user[0]
        }))
      )
    }),
    getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
  })

export default useFetchNotifications
