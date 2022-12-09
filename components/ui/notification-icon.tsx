import { Badge } from '@mui/material'
import { useEffect } from 'react'

import useGetNotificationCount from '../../api-routes/notifications/unread-notification-count'
import NotificationIcon from '../icons/notification.icon'

const MessageIcon = () => {
  const { data } = useGetNotificationCount(true)

  useEffect(() => {
    try {
      if ((data || 0) > 0 && Notification?.permission === 'granted' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration)
            registration.showNotification('Denaurlen', {
              body: `${data} new notifications`,
              icon: './icons/icon-512x512.png',
              tag: 'notifications'
            })
        })
      }

      let nav = {} as Navigator & { setAppBadge: any; clearAppBadge: any }
      nav = { ...nav, ...navigator }

      if (!!nav?.setAppBadge && !!nav?.clearAppBadge) {
        if (data === 0) return nav.clearAppBadge()
        nav.setAppBadge(data)
      }
    } catch (e) {}
  }, [data])

  if (data === 0 || data === undefined) return <NotificationIcon />

  return (
    <Badge color="error" badgeContent={data} variant="standard">
      <NotificationIcon />
    </Badge>
  )
}

export default MessageIcon
