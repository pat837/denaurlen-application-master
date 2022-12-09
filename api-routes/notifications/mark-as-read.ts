import { AxiosResponse } from 'axios'
import { InfiniteData, useMutation } from 'react-query'

import { queryClient } from '../../config/query-client'
import { notificationsKey } from './get-notifications'
import notificationsRoutes from './notifications.routes'
import { unreadNotificationCount } from './unread-notification-count'

import type { GetNotificationResponse_, GetUnreadNotificationCountResponse_ } from '../../types/notifications.types'

type NotificationsData = InfiniteData<AxiosResponse<GetNotificationResponse_, any>>
type NotificationCountData = AxiosResponse<GetUnreadNotificationCountResponse_>

const useMarkAsRead = () => useMutation(notificationsRoutes.markAsRead)

export const useMarkAllAsRead = () =>
  useMutation(
    (notificationIds: string[]) => Promise.all(notificationIds.map(id => notificationsRoutes.markAsRead(id))),
    {
      onMutate: () => {
        const [notificationCountData, notificationsData] = [
          queryClient.getQueryData<NotificationCountData>(unreadNotificationCount),
          queryClient.getQueryData<NotificationsData>(notificationsKey)
        ]

        if (notificationCountData)
          queryClient.setQueryData<NotificationCountData>(unreadNotificationCount, {
            ...notificationCountData,
            data: { notifyCount: 0 }
          })
        if (notificationsData)
          queryClient.setQueryData<NotificationsData>(notificationsKey, {
            ...notificationsData,
            pages: notificationsData.pages.map(page => ({
              ...page,
              data: {
                ...page.data,
                data: page.data.data.map(notification => ({
                  ...notification,
                  views: ['read']
                }))
              }
            }))
          })
      },
      onSettled: () => {
        queryClient.invalidateQueries(notificationsKey)
        queryClient.invalidateQueries(unreadNotificationCount)
      }
    }
  )

export default useMarkAsRead
