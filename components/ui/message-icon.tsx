import { useEffect } from 'react'
import { Badge } from '@mui/material'

import useNewMessageCount from '../../api-routes/messaging/unread-message'
import ChatIcon from '../icons/chat.icon'

const MessageIcon = () => {
  const { data } = useNewMessageCount({ watch: true })

  useEffect(() => {
    try {
      if ((data || 0) > 0 && Notification?.permission === 'granted' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration)
            registration.showNotification('Denaurlen', {
              body: `${data} new messages`,
              icon: './icons/icon-512x512.png',
              tag: 'messaging',
              badge: `${data} new messages`
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

  if (data === 0 || data === undefined) return <ChatIcon />

  return (
    <Badge color="error" badgeContent={data} variant="standard">
      <ChatIcon />
    </Badge>
  )
}

export default MessageIcon
