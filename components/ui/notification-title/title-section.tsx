import { IconButton } from '@mui/material'

import useFetchNotifications from '../../../api-routes/notifications/get-notifications'
import { useMarkAllAsRead } from '../../../api-routes/notifications/mark-as-read'
import useFetchUnreadNotificationCount from '../../../api-routes/notifications/unread-notification-count'
import usePopup from '../../../hooks/popup.hook'
import ChevronLeftIcon from '../../icons/chevron-left.icon'
import MessageTickIcon from '../../icons/message-tick.icon'
import { BalanceButton } from '../balance-info'
import { NOTIFICATIONS_PER_PAGE } from '../notification-list'
import css from './title-section.module.scss'

const NotificationCount = () => {
  const { data: unreadCount } = useFetchUnreadNotificationCount()

  if (!unreadCount) return <></>

  return <p>{unreadCount} new notifications</p>
}

const MarkAsReadButton = () => {
  const { data: unreadCount } = useFetchUnreadNotificationCount()
  const { data: notifications } = useFetchNotifications(NOTIFICATIONS_PER_PAGE)
  const { mutate: markAllAsRead } = useMarkAllAsRead()

  const markAllAsReadHandler = () => {
    let notificationIdList: string[] = []
    notifications?.pages.forEach(page =>
      page.forEach(notification => {
        if (notification.isNew) notificationIdList.push(notification._id)
      })
    )

    markAllAsRead(notificationIdList)
  }

  if (!unreadCount) return <></>

  return (
    <IconButton aria-label="marks-as-read" onClick={markAllAsReadHandler}>
      <MessageTickIcon />
    </IconButton>
  )
}

const NotificationTitleSection = () => {
  const { closePopup } = usePopup()

  return (
    <>
      <div className={css.title}>
        <h3>Notifications</h3>
        <NotificationCount />
      </div>
      <div className={css.appbar}>
        <IconButton aria-label="back" edge="start" onClick={closePopup}>
          <ChevronLeftIcon />
        </IconButton>
        <div className={css.options}>
          <MarkAsReadButton />
          <BalanceButton />
        </div>
      </div>
    </>
  )
}

export { NotificationTitleSection }
